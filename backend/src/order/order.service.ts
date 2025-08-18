import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
public async create(dto: CreateOrderDto) {
  const productIds = dto.items.map(i => i.productId);
  const products = await this.prismaService.product.findMany({
    where: { id: { in: productIds } },
  });

  const orderItemsData = dto.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${item.productId} not found`);
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });
 const customer = await this.prismaService.customer.create({
  data: {
    fullName: dto.name,
    email:dto.email,
    phoneNUmber: dto.phoneNUmber,
    address: dto.address,
  }
 })
  const data = await this.prismaService.order.create({
    data: {
      customerId: customer.id,
      status: 'pending',
      items: {
        create: orderItemsData.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      }
    },
    include: {
      items: true,customer:true
    },
  });

  try {
    await axios.post(
      'https://nguyenhuuuoc.app.n8n.cloud/webhook-test/8e92b935-8a9e-41b7-a434-76fa8b3d305f',
      data
    );
    console.log('Webhook sent to n8n');
  } catch (err) {
    console.error('Failed to send webhook', err);
  }

  return data;
}
  findAll() {
    return this.prismaService.order.findMany({
      include: {
        items: true
      },
    });
  }
}
