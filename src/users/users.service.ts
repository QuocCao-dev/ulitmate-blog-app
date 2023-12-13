import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import _omit from 'lodash/omit';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { comparePassword, hashPassword, signJwt } from './utils';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return _omit(user, ['password']);
  }

  async login(loginUseDto: LoginUserDto) {
    const { email, password } = loginUseDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const token = signJwt(user.id);

    return { token };
  }

  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getProfile(username: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
        _count: {
          select: {
            posts: true,
            followings: true,
            followedBy: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const followedBy = await this.prismaService.user.findUnique({
      where: {
        username,
      },
      select: {
        followedBy: {
          where: {
            id: userId,
          },
        },
      },
    });

    return { user, isFollowing: !!followedBy?.followedBy?.length };
  }

  async getUserPosts(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const posts = await this.prismaService.post.findMany({
      where: { authorId: user.id },
    });

    return posts;
  }

  async followUser(userId: string, followingUserId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        followings: {
          connect: {
            id: followingUserId,
          },
        },
      },
    });

    return { success: true };
  }

  async unfollowUser(userId: string, followingUserId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        followings: {
          disconnect: {
            id: followingUserId,
          },
        },
      },
    });

    return { success: true };
  }

  async getAllFollowers(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        followings: {
          select: {
            name: true,
            username: true,
            id: true,
            image: true,
          },
        },
      },
    });
    return user;
  }

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
