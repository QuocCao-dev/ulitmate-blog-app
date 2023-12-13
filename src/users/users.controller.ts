import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginUserDto, loginUserSchema } from './dto/login-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

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

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Get('followers')
  getAllFollowers(@Body('id') id: string) {
    return this.usersService.getAllFollowers(id);
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  getProfile(
    @Param('username') username: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.getProfile(username, userId);
  }

  @Get(':username/posts')
  getPosts(@Param('username') username: string) {
    return this.usersService.getUserPosts(username);
  }

  @Post('follow')
  @UseGuards(AuthGuard)
  followUser(
    @Body('followingUserId') followingUserId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.followUser(userId, followingUserId);
  }

  @Delete('follow')
  @UseGuards(AuthGuard)
  unfollowUser(
    @Body('followingUserId') followingUserId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.unfollowUser(userId, followingUserId);
  }
}
