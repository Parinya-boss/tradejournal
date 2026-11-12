import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Matches(/\S/, { message: 'name ต้องไม่เป็นค่าว่าง' })
  @MaxLength(255)
  name: string;
}

export class UpdateAccountDto {
  @IsString()
  @Matches(/\S/, { message: 'name ต้องไม่เป็นค่าว่าง' })
  @MaxLength(255)
  name: string;
}
