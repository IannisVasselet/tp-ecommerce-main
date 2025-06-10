import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto } from './dto/get-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: GetOrderDto })
  @UsePipes(new ValidationPipe())
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<GetOrderDto> {
    return this.orderService.createOrderFromCart(createOrderDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user orders' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User orders', type: [GetOrderDto] })
  async getUserOrders(@Param('userId') userId: string): Promise<GetOrderDto[]> {
    return this.orderService.findUserOrders(userId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: GetOrderDto })
  async getOrderDetails(@Param('orderId') orderId: string): Promise<GetOrderDto> {
    return this.orderService.findOrderById(orderId);
  }

  // Legacy endpoints for compatibility
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
}
