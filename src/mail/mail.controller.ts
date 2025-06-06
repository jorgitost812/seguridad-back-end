import { Controller, Get, Req, UseGuards, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {

    constructor(private mailService: MailService){}

    @UseGuards(JwtAuthGuard)
    @Get('hola')
    welcome() {
        const tecnico = 'Eliseo';
        const xxX = 'luis.guerra@ltu.jovenclub.cu';
        return this.mailService.sendWelcomeEmail(xxX, tecnico);
    }

    @UseGuards(JwtAuthGuard)
    @Post('notification')
    notification(@Body() body: any) {
	console.log('El correo fue enviado control');
        /*const tecnico = 'ronald.puig@ltu.jovenclub.cu';
        const adminJC = 'luis.guerra@ltu.jovenclub.cu';
        const supervisor = 'Irma.rey@ltu.jovenclub.cu';
        const nombrejc = 'JCpp-1';
        const nombrepc = 'PTGI';
        const inventario = '090053';
        const causa = 'Mantenimiento';*/
        return this.mailService.Notificacion(body);
		//return this.mailService.Notificacion(tecnico, adminJC, supervisor, nombrejc, nombrepc,inventario, causa)
    }
	
	
	
	
    /*notification(@Param('email') email: string, @Param('tecnico') tecnico: string, 
    @Param('nombrepc') nombrepc: string, @Param('nombrejc') nombrejc: string, 
    @Param('supervisor') supervisor: string, @Param('causa') causa: string) {
     /*   const tecnico = 'Yordanis Carralero';
        const adminjc = 'yordanis.carralero@ltu.jovenclub.cu'*/
        //return this.mailService.SendNotification(email, tecnico/*, nombrepc, nombrejc, supervisor, causa);


    /*

    @UseGuards(JwtAuthGuard)
    @Post('notificacion')
    notificacion(@Param('adminjc') adminjc: string, @Param('tecnico') tecnico: string) {
        return this.mailService.NotificacionContrasena(adminjc, tecnico/*, nombrepc, nombrejc, supervisor, causa);
        }*/
}
