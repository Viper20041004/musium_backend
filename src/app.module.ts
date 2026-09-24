import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma_module';
import { SongsModule } from './songs/songs.module';

import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    SongsModule,

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }