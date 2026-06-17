import { Body, Controller, Post, Logger, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { iniSesionService } from '../usuarios/services/inisesion.service';
import { AuthThrottleGuard } from '../common/guards/auth-throttle.guard';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly iniSesionService: iniSesionService,
  ) {}

  @Post('login')
  @UseGuards(AuthThrottleGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log(
      `Login request received for email ending in @${loginUserDto.email.split('@')[1] || 'unknown'}`,
    );
    try {
      const result = await this.authService.login(loginUserDto);
      await this.iniSesionService.create({
        email: loginUserDto.email,
      });
      this.logger.log('Login successful');
      return result;
    } catch (error) {
      this.logger.warn('Login failed');
      throw error;
    }
  }
}
