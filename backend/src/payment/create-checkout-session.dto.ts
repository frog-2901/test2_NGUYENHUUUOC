import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  currency: string; 
}