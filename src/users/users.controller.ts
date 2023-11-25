import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginUserDto, loginUserSchema } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.usersService.getProfile(username);
  }

  @Get(':username/posts')
  getPosts(@Param('username') username: string) {
    return this.usersService.getUserPosts(username);
  }

  @Post('follow')
  followUser(@Body('followingUserId') followingUserId: string) {
    return this.usersService.followUser(followingUserId);
  }

  @Delete('follow')
  unfollowUser(@Body('followingUserId') followingUserId: string) {
    return this.usersService.unfollowUser(followingUserId);
  }

  @Get('followers')
  getAllFollowers(@Body('id') id: string) {
    return this.usersService.getAllFollowers(id);
  }
}
