import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, FindUserCartDto, UpdateCartItemDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Patch()
  async update(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    updateCartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartService.update(updateCartItemDto);
  }

  @Get()
  async find(@Query() findUserCartDto: FindUserCartDto) {
    return await this.cartService.find(findUserCartDto);
  }

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return await this.cartService.create(createCartDto);
  }
}
