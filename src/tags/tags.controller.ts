import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Body() id: string) {
    return this.tagsService.remove(id);
  }
}
