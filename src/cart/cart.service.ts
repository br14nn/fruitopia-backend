import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto, FindUserCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

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

      // return createCartDto;
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
