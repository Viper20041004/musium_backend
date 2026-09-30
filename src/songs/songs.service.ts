import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma_service';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    // 1. Lấy ngẫu nhiên 50 ID bài hát
    const randomSongs = await this.prisma.$queryRaw<{ id: number }[]
    >`
      SELECT id
      FROM songs
      ORDER BY RANDOM()
      LIMIT 50
    `;

    const songIds = randomSongs.map((song) => song.id);

    // Không có bài hát
    if (songIds.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
        },
      };
    }

    // 2. Lấy thông tin đầy đủ của 50 bài
    const songs = await this.prisma.song.findMany({
      where: {
        id: {
          in: songIds,
        },
      },
      include: {
        artist: true,
        album: true,
        genre: true,
      },
    });

    // 3. Giữ thứ tự random ban đầu
    const songMap = new Map(
      songs.map((song) => [song.id, song]),
    );

    const randomSongsWithRelations = songIds
      .map((id) => songMap.get(id))
      .filter((song) => song !== undefined);

    return {
      data: randomSongsWithRelations,
      meta: {
        total: randomSongsWithRelations.length,
      },
    };
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