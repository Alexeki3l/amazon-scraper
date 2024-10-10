import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException();
    }
    // const payload = { sub: user.id, username: user.username };
    return {
      // access_token: await this.jwtService.signAsync(payload),
      access_token: user.token,
    };
  }
}
