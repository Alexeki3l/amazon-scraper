import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['access_token'];
    if (!token) throw new UnauthorizedException('Token not found');
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
