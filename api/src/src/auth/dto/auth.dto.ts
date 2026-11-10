import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @IsByteLength(1, 72, {
    message: 'password ต้องมีขนาดไม่เกิน 72 ไบต์',
  })
  @Matches(/\S/, { message: 'password ต้องไม่เป็นค่าว่าง' })
  password: string;
}
