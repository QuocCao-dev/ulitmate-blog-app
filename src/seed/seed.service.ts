import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prismaService: PrismaService) {}

  async seed() {
    const fakeArray = Array.from({ length: 50 }).map((_, idx) => idx);
    console.log('seeding the db!');

    for await (const _ of fakeArray) {
      const user = await this.prismaService.user.create({
        data: {
          name: faker.name.fullName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          image: faker.internet.avatar(),
          password: faker.internet.password(),
        },
      });

      const postsFakeArray = Array.from({
        length: faker.datatype.number({ max: 20, min: 5 }),
      }).map((_, idx) => idx);

      for await (const _ of postsFakeArray) {
        await this.prismaService.post.create({
          data: {
            title: faker.random.words(10),
            description: faker.lorem.lines(4),
            text: faker.lorem.paragraphs(5),
            html: faker.lorem.paragraphs(5),
            slug: faker.lorem.slug(),
            author: {
              connect: {
                id: user.id,
              },
            },
            featuredImage: faker.image.unsplash.technology(),
            tags: {
              connectOrCreate: {
                create: {
                  name: faker.random.words() + faker.random.word(),
                  description: faker.lorem.paragraph(1),
                  slug: faker.lorem.slug(),
                },
                where: {
                  id: faker.datatype.uuid(),
                },
              },
            },
          },
        });
      }
    }

    console.log('seed completed!');
  }

  async removeAll() {
    await this.prismaService.post.deleteMany();
    // await this.prismaService.user.deleteMany();
    // await this.prismaService.tag.deleteMany();
    // await this.prismaService.comment.deleteMany();
    // await this.prismaService.like.deleteMany();
    // await this.prismaService.bookmark.deleteMany();
  }
}
