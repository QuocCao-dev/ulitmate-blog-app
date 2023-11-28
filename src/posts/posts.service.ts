import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

const LIMIT = 10;

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const { title, description, text } = createPostDto;

    const postExist = await this.prismaService.post.findUnique({
      where: { title },
    });

    if (postExist) {
      throw new HttpException('Post already exists', HttpStatus.BAD_REQUEST);
    }

    return this.prismaService.post.create({
      data: {
        title,
        description,
        text,
        slug: slugify(title, { lower: true }),
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(cursor: string) {
    const posts = await this.prismaService.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        bookmarks: true,
      },
      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (posts.length > LIMIT) {
      const nextItem = posts.pop();
      if (nextItem) nextCursor = nextItem.id;
    }

    return { posts, nextCursor };
  }

  async findOne(slug: string) {
    if (!slug) {
      throw new HttpException('Slug is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { slug },
      select: {
        id: true,
        description: true,
        title: true,
        text: true,
        html: true,
        slug: true,
        featuredImage: true,
        authorId: true,
        likes: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return post;
  }

  async like(id: string, userId: string) {
    if (!id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.prismaService.like.create({
      data: {
        post: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async unlike(id: string, userId: string) {
    if (!id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.prismaService.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });
  }

  async bookmark(id: string, userId: string) {
    if (!id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.prismaService.bookmark.create({
      data: {
        post: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeBookmark(id: string, userId: string) {
    if (!id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.prismaService.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });
  }

  async getReadingList(id: string, userId: string) {
    if (!id) {
      throw new HttpException('Post id is required', HttpStatus.BAD_REQUEST);
    }
    const allBookmarks = await this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        post: {
          select: {
            title: true,
            description: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            createdAt: true,
            slug: true,
          },
        },
      },
    });

    return allBookmarks;
  }
}