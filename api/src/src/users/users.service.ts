import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
} from './dto/users.dto';
import { handleDatabaseError } from '../../common/database-error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private toUserResponse(
    user: Pick<User, 'id' | 'email' | 'display_name' | 'role' | 'createdAt'>,
  ) {
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async getAllUsers() {
    const getUser = await this.usersRepository.find();
    return getUser.map((user) => this.toUserResponse(user));
  }

  async getOneById(id: number) {
    const getUser = await this.usersRepository.findOneBy({ id });
    if (!getUser) {
      throw new NotFoundException('ไม่พบ User ที่คุณค้นหา');
    }
    return this.toUserResponse(getUser);
  }

  async createUser(dto: CreateUserDto) {
    const password_hash = await bcrypt.hash(dto.password, 12);
    const createUser = this.usersRepository.create({
      email: dto.email,
      display_name: dto.display_name,
      password_hash: password_hash,
    });
    try {
      const saveUser = await this.usersRepository.save(createUser);
      return this.toUserResponse(saveUser);
    } catch (error: unknown) {
      handleDatabaseError(
        error,
        'อีเมลนี้ถูกใช้งานแล้ว',
        'ไม่สามารถสร้างผู้ใช้ได้เนื่องจากข้อมูลที่เกี่ยวข้องไม่ถูกต้อง',
      );
    }
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const getUser = await this.usersRepository.findOneBy({ id });
    if (!getUser) {
      throw new NotFoundException('ไม่พบ User ที่คุณค้นหา');
    }
    getUser.display_name = dto.display_name;

    const saveUser = await this.usersRepository.save(getUser);

    return this.toUserResponse(saveUser);
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const checkUser = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.id = :id', { id })
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('ไม่พับ User ที่คุณค้นหา');
    }

    const passwordMatches = await bcrypt.compare(
      dto.currentPassword,
      checkUser.password_hash,
    );

    if (!passwordMatches) {
      throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง');
    }

    checkUser.password_hash = await bcrypt.hash(dto.newPassword, 12);

    await this.usersRepository.save(checkUser);

    return { message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' };
  }

  async deleteUser(id: number) {
    try {
      const result = await this.usersRepository.delete({ id: id });

      if (result.affected === 0) {
        throw new NotFoundException('ไม่พับ User ที่คุณต้องการลบ');
      }

      return { message: 'ลบบัญชีเรียบร้อย' };
    } catch (error: unknown) {
      handleDatabaseError(
        error,
        'ข้อมูลซ้ำ',
        'ไม่สามารถลบบัญชีได้ เนื่องจากยังมีบัญชีเทรดที่เกี่ยวข้อง',
      );
    }
  }
}
