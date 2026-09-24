import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma_service';

@Injectable()
export class AppService {

  constructor(private readonly prisma: PrismaService) { }

  async getHello() {
    const artists = await this.prisma.artist.findMany();

    return {
      message: 'Musium backend is running',
      artists,
    };
  }
}
