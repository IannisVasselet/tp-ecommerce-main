import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({ example: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3d3d' })
  id: string;

  @ApiProperty({ example: 'product-456' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 99.99 })
  price: number;
}

export class GetOrderDto {
  @ApiProperty({ example: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3d3d' })
  id: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 199.98 })
  totalPrice: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
}
