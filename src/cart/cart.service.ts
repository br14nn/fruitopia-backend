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
            {
              userID: createCartDto.userID,
            },
            {
              productID: createCartDto.productID,
            },
          ],
        },
      });

      if (!foundData) {
        await this.prismaService.cart.create({
          data: {
            ...createCartDto,
            quantity: 1,
          },
        });

        return { message: 'Created a cart data', error: null };
      } else {
        await this.prismaService.cart.update({
          where: {
            id: foundData.id,
          },
          data: {
            quantity: {
              increment: 1,
            },
          },
        });

        return { message: 'Updated a cart data', error: null };
      }
    } catch (error) {
      throw new BadRequestException('Failed to create cart');
    }
  }
}
