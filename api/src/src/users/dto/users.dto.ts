import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, { message: 'display_name ต้องไม่เป็นค่าว่าง' })
  @MaxLength(255)
  display_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @IsByteLength(1, 72, {
    message: 'password ต้องมีขนาดไม่เกิน 72 ไบต์',
  })
  @Matches(/\S/, { message: 'password ต้องไม่เป็นค่าว่าง' })
  password: string;
}

export class UpdateProfileDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, { message: 'display_name ต้องไม่เป็นค่าว่าง' })
  @MaxLength(255)
  display_name: string;
}

export class ChangePasswordDto {
  @IsString()
  @Matches(/\S/, { message: 'กรุณาระบุรหัสผ่านเดิม' })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @IsByteLength(1, 72, {
    message: 'รหัสผ่านใหม่ต้องมีขนาดไม่เกิน 72 ไบต์',
  })
  @Matches(/\S/, {
    message: 'รหัสผ่านใหม่ต้องไม่เป็นค่าว่าง',
  })
  newPassword: string;
}
