import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateCheckoutSessionDto } from './create-checkout-session.dto';
import Stripe from 'stripe';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private stripeService: StripeService,
    private config: ConfigService,
    
  ) {}

  async createCheckoutSession(dto: CreateCheckoutSessionDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${dto.orderId} not found`);
    }

    if (order.items.length === 0) {
      throw new BadRequestException(`Order #${dto.orderId} has no items`);
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: dto.currency,
        product_data: {
          name: item.product.name,
          description: item.product.description ?? undefined,
        },
        unit_amount: item.price, 
      },
      quantity: item.quantity,
    }));

    return this.stripeService.getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${this.config.get<string>('APP_URL')}`,
      cancel_url: `${this.config.get<string>('APP_URL')}`,
      metadata: {
        orderId: order.id.toString(),
      },
    });
  }
  async handleWebhook(rawBody: Buffer, signature: string){
    const stripe = this.stripeService.getStripe();
    const secret = this.config.get<string>("STRIPE_WEBHOOK_SECRET")!;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      this.logger.error('Webhook signature verification failed', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.handleCheckoutComplete(session);
    } else {
      this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
  // ====================PRIVATE METHODS====================
  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      this.logger.warn('No order ID found in session metadata');
      return;
    }

    // Cập nhật trạng thái đơn hàng
    await this.prisma.order.update({
      where: { id: parseInt(orderId, 10) },
      data: { status: 'PAID' },
    });

    this.logger.log(`Order #${orderId} has been marked as paid`);
    const order = await this.prisma.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: {customer: true},
    });
    if(order?.customer?.email) {
      await this.mailService.sendMail(order.customer.email, orderId);
  }
this.logger.log(`Processed payment for order #${orderId}`);}

}
