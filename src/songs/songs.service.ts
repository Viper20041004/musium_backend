import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma_service';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.song.findMany({
      include: {
        artist: true,
        album: true,
        genre: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        artist: true,
        album: true,
        genre: true,
      },
    });
  }
}