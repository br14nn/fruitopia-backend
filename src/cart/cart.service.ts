import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto, FindUserCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

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
      console.log(error);
      throw new ForbiddenException('Failed to update a cart item');
    }
  }

  async find(findUserCartDto: FindUserCartDto) {
    try {
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
      });

      return { message: userCart, error: null };
    } catch (error) {
      throw new NotFoundException(
        "Something went wrong retrieving a user's cart list",
      );
    }
  }

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
      console.log(error);
      throw new BadRequestException('Failed to create cart');
    }
  }
}
