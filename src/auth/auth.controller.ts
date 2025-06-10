import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SETTINGS } from "src/app.utils";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body(SETTINGS.VALIDATION_PIPE) loginUserDto: LoginUserDto) {
        console.log('Login request received for:', loginUserDto.email);
        try {
            const result = await this.authService.login(loginUserDto);
            console.log('Login successful');
            return result;
        } catch (error) {
            console.error('Login controller error:', error);
            throw error;
        }
    }
}