import { PartialType } from '@nestjs/swagger';
import { AddItemToCartDto } from './create-cart.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto extends PartialType(AddItemToCartDto) {
  @ApiProperty({ 
    example: 3, 
    description: 'New quantity for the cart item',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
