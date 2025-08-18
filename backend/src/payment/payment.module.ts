import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { MailModule } from 'src/mail/mail.module';

@Module({imports: [PrismaModule, StripeModule, MailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
