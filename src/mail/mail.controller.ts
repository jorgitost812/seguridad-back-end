import { Controller, Get, Req, UseGuards, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailService } from './mail.service';

@Controller('api/mail')
export class MailController {

    constructor(private mailService: MailService){}

    @UseGuards(JwtAuthGuard)
    @Post('welcome')
    welcome(@Body() body: { to: string, tecnico: string }) {
        return this.mailService.sendWelcomeEmail(body.to, body.tecnico);
    }

    @UseGuards(JwtAuthGuard)
    @Post('notification')
    notification(@Body() body: any) {
        return this.mailService.Notificacion(body);
    }
}
