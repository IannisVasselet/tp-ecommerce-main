import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto, OrderItemDto } from './dto/get-order.dto';
import { firstValueFrom } from 'rxjs';

interface CartItemResponse {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartResponse {
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
}

interface ProductResponse {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

@Injectable()
export class OrderService {
  private readonly cartServiceUrl: string;
  private readonly productServiceUrl: string;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.cartServiceUrl = this.configService.get<string>('CART_SERVICE_URL', 'http://localhost:3002');
    this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL', 'http://localhost:3001');
  }

  async createOrderFromCart(createOrderDto: CreateOrderDto): Promise<GetOrderDto> {
    const { userId } = createOrderDto;

    // 1. Récupérer le panier de l'utilisateur
    const cart = await this.getCartItems(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Valider les produits et calculer le prix total
    let totalPrice = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const cartItem of cart.items) {
      const product = await this.validateProduct(cartItem.productId);
      
      if (!product.isAvailable) {
        throw new BadRequestException(`Product ${cartItem.productId} is not available`);
      }

      const itemPrice = product.price * cartItem.quantity;
      totalPrice += itemPrice;

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    // 3. Créer la commande avec transaction
    const order = await this.orderRepository.manager.transaction(async manager => {
      // Créer l'ordre
      const newOrder = manager.create(Order, {
        userId,
        totalPrice,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await manager.save(newOrder);

      // Créer les items de la commande
      const orderItemsToSave = orderItems.map(item => 
        manager.create(OrderItem, {
          ...item,
          orderId: savedOrder.id,
        })
      );
      await manager.save(OrderItem, orderItemsToSave);

      return manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items'],
      });
    });

    if (!order) {
      throw new BadRequestException('Failed to create order');
    }

    // 4. Vider le panier après création de la commande
    await this.clearCart(userId);

    return this.mapToDto(order);
  }

  async findUserOrders(userId: string): Promise<GetOrderDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map(order => this.mapToDto(order));
  }

  async findOrderById(orderId: string): Promise<GetOrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapToDto(order);
  }

  private async getCartItems(userId: string): Promise<CartResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cartServiceUrl}/cart/${userId}`)
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Unable to retrieve cart');
    }
  }

  private async validateProduct(productId: string): Promise<ProductResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new BadRequestException(`Product ${productId} not found`);
      }
      throw new BadRequestException('Unable to validate product');
    }
  }

  private async clearCart(userId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(`${this.cartServiceUrl}/cart/${userId}`)
      );
    } catch (error) {
      // Log but don't fail the order creation
      console.warn(`Failed to clear cart for user ${userId}:`, error.message);
    }
  }

  private mapToDto(order: Order): GetOrderDto {
    return {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  // Legacy methods for compatibility
  create(createOrderDto: any) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
