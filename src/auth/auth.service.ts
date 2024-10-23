import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // Serivicio de autenticación("Login") de usuarios
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    user.is_active = true;
    return {
      access_token: user.token,
    };
  }
}
