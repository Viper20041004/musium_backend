import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const MUSIC_DIR = path.join(process.cwd(), 'uploads/hit_viet_quoc_dan');

async function main() {
  const folders = fs.readdirSync(MUSIC_DIR, {
    withFileTypes: true,
  });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const songFolder = path.join(MUSIC_DIR, folder.name);
    const lyricsPath = path.join(songFolder, 'lyrics.txt');

    if (!fs.existsSync(lyricsPath)) {
      console.log(`⚠️ Không có lyrics: ${folder.name}`);
      continue;
    }

    const lyric = fs.readFileSync(lyricsPath, 'utf-8').trim();

    console.log('Newline count:', lyric.split('\n').length - 1);
    console.log(JSON.stringify(lyric.substring(0, 300)));

    if (!lyric) {
      console.log(`⚠️ Lyrics rỗng: ${folder.name}`);
      continue;
    }

    const song = await prisma.song.findFirst({
      where: {
        audioUrl: {
          contains: folder.name,
        },
      },
    });

    if (!song) {
      console.log(`❌ Không tìm thấy song: ${folder.name}`);
      continue;
    }

    await prisma.song.update({
      where: {
        id: song.id,
      },
      data: {
        lyric,
      },
    });

    console.log(`✅ Đã import lyrics: ${song.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());