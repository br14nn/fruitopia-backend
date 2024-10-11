import { IsIn, IsInt } from 'class-validator';

export default class UpdateCartItemDto {
  @IsInt()
  id: number;

  @IsIn(['increment', 'decrement'])
  quantity: 'increment' | 'decrement';
}
