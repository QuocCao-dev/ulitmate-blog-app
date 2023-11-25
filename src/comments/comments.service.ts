import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const { body } = createCommentDto;

    if (!postId) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const post = await this.prismaService.comment.create({
      data: {
        text: body,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return post;
  }

  async findAll(postId: string) {
    const posts = await this.prismaService.comment.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        text: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        createdAt: true,
      },
    });

    return posts;
  }
}
