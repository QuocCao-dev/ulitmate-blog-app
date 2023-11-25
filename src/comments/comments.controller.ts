import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentsService.create(userId, postId, createCommentDto);
  }

  @Get(':postId/comments')
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }
}
