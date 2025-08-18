import { BadRequestException, Body, Controller, Header, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './create-checkout-session.dto';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Post('create-checkout-session')
  async createCheckout(@Body() dto:CreateCheckoutSessionDto) {
    const session = await  this.paymentService.createCheckoutSession(dto);
    return {
      url: session.url,
    };
  }
  @Post('webhook')
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    if(!signature) throw new BadRequestException("Missing Stripe signature header");
    if(!req.rawBody)throw new BadRequestException("Missing raw body in request"); 
    return this.paymentService.handleWebhook(req.rawBody, signature)
  }
}

