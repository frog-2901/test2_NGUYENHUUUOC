import { IsInt, IsArray, ValidateNested, Min, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  phoneNUmber: string;
  @IsString()
  address:string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
