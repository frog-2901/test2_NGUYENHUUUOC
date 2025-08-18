import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), PrismaModule, PaymentModule, OrderModule, CustomerModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
