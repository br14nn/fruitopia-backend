import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
