import { AuthService } from './auth.service';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin() {
    return this.authService.signin();
  }

  @Post('/signup')
  signup() {
    return this.authService.signup();
  }
}
