import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
} from './dto/users.dto';
import { Public } from '../auth/public.decorator';
import { AdminGuard } from '../auth/admin.guard';
import type { AuthRequest } from '../auth/auth-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  getUser() {
    return this.usersService.getAllUsers();
  }

  @Get('me')
  getMe(@Req() req: AuthRequest) {
    return this.usersService.getOneById(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Get('getid/:id')
  getUserId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOneById(id);
  }

  @Public()
  @Post('create')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch('updateprofile/')
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('changepassword/')
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
