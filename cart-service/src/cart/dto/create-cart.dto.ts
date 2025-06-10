import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({ 
    example: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3d3d', 
    description: 'Product ID to add to cart' 
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ 
    example: 2, 
    description: 'Quantity of the product to add',
    minimum: 1,
    default: 1
  })
  @IsNumber()
  @Min(1)
  quantity: number = 1;
}
