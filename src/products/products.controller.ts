import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: 'SUMMER' | 'FALL' | 'SPRING' | 'WINTER',
    @Query('order-price-by') orderPriceBy?: 'asc' | 'desc',
  ) {
    return this.productsService.findAll(category, orderPriceBy);
  }
}
