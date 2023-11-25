import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.postsService.create(userId, createPostDto);
  }

  @Get()
  findAll(@Query('cursor') cursor: string) {
    return this.postsService.findAll(cursor);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.like(id, userId);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.unlike(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard)
  bookmark(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard)
  removeBookmark(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.removeBookmark(id, userId);
  }

  @Get(':id/bookmark')
  @UseGuards(AuthGuard)
  getReadingList(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postsService.getReadingList(id, userId);
  }
}
