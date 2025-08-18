import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
    constructor(private readonly prismaService: PrismaService){
    }
    public async getCusstomerById(id: number) {
        return this.prismaService.customer.findUnique({
            where: { id }
        });
    }
}
