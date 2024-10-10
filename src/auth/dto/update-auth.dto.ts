import { PartialType } from '@nestjs/swagger';
import { SignInDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignInDTO) {}
