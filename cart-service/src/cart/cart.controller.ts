import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/create-cart.dto';
import { GetCartDto, CartItemDto } from './dto/get-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Item added to cart', type: CartItemDto })
  @UsePipes(new ValidationPipe())
  async addItemToCart(
    @Param('userId') userId: string,
    @Body() addItemDto: AddItemToCartDto,
  ): Promise<CartItemDto> {
    return this.cartService.addItemToCart(userId, addItemDto);
  }

  @Delete(':userId/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Item removed from cart' })
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.cartService.removeItemFromCart(userId, productId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User cart', type: GetCartDto })
  async getCart(@Param('userId') userId: string): Promise<GetCartDto> {
    return this.cartService.getCart(userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'Cart cleared' })
  async clearCart(@Param('userId') userId: string): Promise<void> {
    return this.cartService.clearCart(userId);
  }

  // Legacy endpoints for compatibility
  @Get('')
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Post('')
  update(
    @Headers('x-user-id') userId: string,
    @Body() updateCartDto: any,
  ) {
    return this.cartService.update(+userId, updateCartDto);
  }

  @Delete('')
  remove(@Headers('x-user-id') userId: string) {
    return this.cartService.remove(+userId);
  }
}
