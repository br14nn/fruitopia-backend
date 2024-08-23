import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    keyword?: string,
    category?: 'SUMMER' | 'FALL' | 'SPRING' | 'WINTER',
    orderPriceBy?: 'asc' | 'desc',
  ) {
    try {
      const data: any[] = await this.prismaService.product.findMany({
        where: {
          category: category,
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        orderBy: {
          price: orderPriceBy,
        },
      });

      if (data.length <= 0) throw Error();

      return { message: data, error: null };
    } catch (error) {
      throw new NotFoundException('No data was found');
    }
  }
}
