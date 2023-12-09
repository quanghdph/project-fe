import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { RefreshTokenGuard } from 'src/common/guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @Permission(Permissions.CreateAdministrator)
  async createAdministrator(@Body() dto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.registerAdministrator(dto);
    return res.json({ response });
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(dto);
    return res.json({ response });
  }

  @Get('logout')
  @Permission()
  async logout(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.logout(req.user['userId']);
    return res.json({ response });
  }

  @Post('customer/register')
  async createCustomer(@Body() dto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.registerCustomer(dto);
    return res.json({ response });
  }

  @Get('me')
  @Permission()
  async me(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.me(req.user['userId']);
    return res.json({ response });
  }

  @Post('refreshToken')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.refreshTokens(req.user['userId'], req.user['refreshToken']);
    return res.json({ response });
  }
}
