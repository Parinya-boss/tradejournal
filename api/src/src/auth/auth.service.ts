import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async userLogin(dto: AuthDto) {
    const findUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!findUser) {
      throw new BadRequestException('User หรือ Password ไม่ถูกต้อง');
    }

    const matchPassword = await bcrypt.compare(
      dto.password,
      findUser.password_hash,
    );

    if (!matchPassword) {
      throw new BadRequestException('User หรือ Password ไม่ถูกต้อง');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: findUser.id,
    });

    return { accessToken };
  }
}
