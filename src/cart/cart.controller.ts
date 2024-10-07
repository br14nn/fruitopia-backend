import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, FindUserCartDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async find(@Query() findUserCartDto: FindUserCartDto) {
    return await this.cartService.find(findUserCartDto);
  }

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return await this.cartService.create(createCartDto);
  }
}
