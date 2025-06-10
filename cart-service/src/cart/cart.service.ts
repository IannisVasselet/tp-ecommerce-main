import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CartItem } from './entities/cart.entity';
import { AddItemToCartDto } from './dto/create-cart.dto';
import { GetCartDto, CartItemDto } from './dto/get-cart.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  private readonly productServiceUrl: string;

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL', 'http://localhost:3001');
  }

  async addItemToCart(userId: string, addItemDto: AddItemToCartDto): Promise<CartItemDto> {
    // Validate product exists
    await this.validateProduct(addItemDto.productId);

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { userId, productId: addItemDto.productId },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += addItemDto.quantity;
      const updatedItem = await this.cartItemRepository.save(existingItem);
      return this.mapToDto(updatedItem);
    } else {
      // Create new cart item
      const newItem = this.cartItemRepository.create({
        userId,
        productId: addItemDto.productId,
        quantity: addItemDto.quantity,
      });
      const savedItem = await this.cartItemRepository.save(newItem);
      return this.mapToDto(savedItem);
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<void> {
    const item = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(item);
  }

  async getCart(userId: string): Promise<GetCartDto> {
    const items = await this.cartItemRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      userId,
      items: items.map(item => this.mapToDto(item)),
      totalItems,
    };
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ userId });
  }

  private async validateProduct(productId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`)
      );
      
      if (!response.data || !response.data.isAvailable) {
        throw new BadRequestException('Product is not available');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new BadRequestException('Product not found');
      }
      throw new BadRequestException('Unable to validate product');
    }
  }

  private mapToDto(cartItem: CartItem): CartItemDto {
    return {
      id: cartItem.id,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    };
  }

  // Legacy methods for compatibility
  findOne(userId: number) {
    return `This action returns a #${userId} cart`;
  }

  update(userId: number, updateCartDto: any) {
    return `This action updates a #${userId} cart`;
  }

  remove(userId: number) {
    return `This action removes a #${userId} cart`;
  }
}
