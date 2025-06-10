import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ 
    example: 'user-123', 
    description: 'User ID who is creating the order' 
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
