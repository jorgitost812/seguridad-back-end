import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
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
    @UseGuards(ThrottlerGuard)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body(SETTINGS.VALIDATION_PIPE) loginUserDto: LoginUserDto) {
        try {
            const result = await this.authService.login(loginUserDto);
            await this.iniSesionService.create({
                email: loginUserDto.email
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}