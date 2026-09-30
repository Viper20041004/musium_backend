import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SongsService } from './songs.service';


@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) { }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.findOne(id);
  }
}