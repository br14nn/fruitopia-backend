import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    category?: 'SUMMER' | 'FALL' | 'SPRING' | 'WINTER',
    orderPriceBy?: 'asc' | 'desc',
  ) {
    try {
      const data: any[] = await this.prismaService.product.findMany({
        where: {
          category: category,
        },
        orderBy: {
          price: orderPriceBy,
        },
      });

      return { data, error: null };
    } catch (error) {
      throw new NotFoundException('No data was found');
    }
  }
}
