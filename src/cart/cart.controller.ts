import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  CreateCartDto,
  DeleteCartItemDto,
  FindUserCartDto,
  UpdateCartItemDto,
} from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return await this.cartService.create(createCartDto);
  }

  @Get()
  async find(@Query() findUserCartDto: FindUserCartDto) {
    return await this.cartService.find(findUserCartDto);
  }

  @Get('/total/:id')
  async getTotal(@Param() params: { id: string }) {
    return this.cartService.getTotal(params);
  }

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

  @Delete()
  async delete(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    deleteCartItemDto: DeleteCartItemDto,
  ) {
    return await this.cartService.delete(deleteCartItemDto);
  }

  @Delete('/checkout/:userID')
  async deleteCartCheckout(@Param() params: { userID: string }) {
    return await this.cartService.deleteCartCheckout(params);
  }
}
