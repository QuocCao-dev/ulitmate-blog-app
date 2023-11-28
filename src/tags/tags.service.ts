import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const { name, description } = createTagDto;

    const existingTag = await this.prismaService.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      throw new HttpException('Tag already exists', HttpStatus.BAD_REQUEST);
    }

    const tag = await this.prismaService.tag.create({
      data: {
        name,
        description,
        slug: slugify(name, { lower: true }),
      },
    });

    return tag;
  }

  async findAll() {
    const tags = await this.prismaService.tag.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tags;
  }

  async remove(id: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.tag.delete({
      where: { id },
    });

    return tag;
  }
}
