import { IsNumber } from 'class-validator';

export default class DeleteCartItemDto {
  @IsNumber()
  id: number;
}
