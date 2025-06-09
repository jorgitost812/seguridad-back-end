import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Req, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SETTINGS } from '../app.utils';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body(SETTINGS.VALIDATION_PIPE) loginUserDto: LoginUserDto) {
        const data = await this.authService.login(loginUserDto);
        return data;
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    @ApiResponse({ type: UserProfileDto })
    async profile(@Req() req: any) {
        return await this.authService.getProfile(req.user);
    }
}