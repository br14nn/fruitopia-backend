import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCartDto,
  DeleteCartItemDto,
  FindUserCartDto,
  UpdateCartItemDto,
} from './dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const foundData = await this.prismaService.cart.findFirst({
        where: {
          AND: [
            { userID: createCartDto.userID },
            { productID: createCartDto.productID },
          ],
        },
      });

      if (!foundData) {
        await this.prismaService.cart.create({
          data: {
            quantity: 1,
            user: { connect: { id: createCartDto.userID } },
            product: { connect: { id: createCartDto.productID } },
          },
        });

        return { message: 'Created a cart data', error: null };
      } else {
        return { message: 'Cart data already exists', error: null };
      }
    } catch (error) {
      throw new BadRequestException('Failed to create cart');
    }
  }

  async find(findUserCartDto: FindUserCartDto) {
    try {
      if (findUserCartDto.userID) {
        const userCart = await this.prismaService.cart.findMany({
          where: {
            userID: findUserCartDto.userID,
          },
          select: {
            id: true,
            quantity: true,
            productID: true,
            product: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        return { message: userCart, error: null };
      }

      return { message: [], error: null };
    } catch (error) {
      throw new NotFoundException(
        "Something went wrong retrieving a user's cart list",
      );
    }
  }

  async getTotal(params: { id: string }) {
    try {
      const data = await this.prismaService.cart.findMany({
        where: {
          userID: params.id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      });

      let total: number = 0;

      for (let i = 0; i < data.length; i++) {
        total = total + data[i].product.price * data[i].quantity;
      }

      return {
        message: { total: parseFloat(total.toFixed(2)) },
        error: null,
      };
    } catch (error) {
      throw new ForbiddenException('Failed to get cart total');
    }
  }

  async update(updateCartItemDto: UpdateCartItemDto) {
    try {
      const foundData = await this.prismaService.cart.findFirst({
        where: {
          id: updateCartItemDto.id,
        },
      });

      if (updateCartItemDto.quantity === 'increment') {
        if (foundData.quantity < 99) {
          await this.prismaService.cart.update({
            where: {
              id: updateCartItemDto.id,
            },
            data: {
              quantity: {
                increment: 1,
              },
            },
          });

          return {
            message: 'Incremented a quantity successfully',
            error: null,
          };
        } else {
          return { message: 'Max quantity value reached', error: null };
        }
      } else if (updateCartItemDto.quantity === 'decrement') {
        if (foundData.quantity > 1) {
          await this.prismaService.cart.update({
            where: {
              id: updateCartItemDto.id,
            },
            data: {
              quantity: {
                decrement: 1,
              },
            },
          });

          return { message: 'Decrement a quantity successfully', error: null };
        } else {
          return { message: 'Minimum quantity value reached', error: null };
        }
      }
    } catch (error) {
      throw new ForbiddenException('Failed to update a cart item');
    }
  }

  async delete(deleteCartItemDto: DeleteCartItemDto) {
    try {
      await this.prismaService.cart.delete({
        where: {
          id: deleteCartItemDto.id,
        },
      });

      return { message: 'Deleted a cart item successfully', error: null };
    } catch (error) {
      throw new ForbiddenException('Failed to delete a cart item');
    }
  }

  async deleteCartCheckout(params: { userID: string }) {
    try {
      const foundData = await this.prismaService.cart.findMany({
        select: {
          userID: true,
          productID: true,
          quantity: true,
        },
        where: {
          userID: params.userID,
        },
      });

      await this.prismaService.orderHistory.createMany({
        data: foundData,
      });

      const numOfDeleted = await this.prismaService.cart.deleteMany({
        where: {
          userID: params.userID,
        },
      });

      return { message: numOfDeleted, error: null };
    } catch (error) {
      throw new BadRequestException('Failed to checkout cart');
    }
  }
}
