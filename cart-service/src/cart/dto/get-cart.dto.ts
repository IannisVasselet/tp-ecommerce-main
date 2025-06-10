import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ example: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3d3d' })
  id: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 'product-456' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetCartDto {
  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];

  @ApiProperty({ example: 3 })
  totalItems: number;
}
