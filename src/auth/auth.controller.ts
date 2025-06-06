import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SETTINGS } from '../app.utils';
//import { ApiTags } from '@nestjs/swagger';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(SETTINGS.VALIDATION_PIPE) loginUserDto: LoginUserDto) {
    const data = this.authService.login(loginUserDto);
    return data;
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any){
        console.log("Usuario: "+req.user.email + " fue autenticado");
        return req.user ;
  }
  
}