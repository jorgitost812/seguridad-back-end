import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SETTINGS } from "src/app.utils";
import { LoginUserDto } from "./dto/login-user.dto";
import { iniSesionService } from "../usuarios/services/inisesion.service";

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly iniSesionService: iniSesionService
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body(SETTINGS.VALIDATION_PIPE) loginUserDto: LoginUserDto) {
        console.log('Login request received for:', loginUserDto.email);
        try {
            const result = await this.authService.login(loginUserDto);
            // Register login trace
            await this.iniSesionService.create({
                email: loginUserDto.email
            });
            console.log('Login successful');
            return result;
        } catch (error) {
            console.error('Login controller error:', error);
            throw error;
        }
    }
}