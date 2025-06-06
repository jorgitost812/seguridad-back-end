import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Usuario } from './../usuarios/entities/usuario.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(xxX: string, tecnico: string) {

    await this.mailerService.sendMail({
      to: "luis.guerra@ltu.jovenclub.cu",
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Bienvenido a nuestra aplicación!',
      template: './welcome', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        xxX, tecnico
      },
    });
  }

  //async Notificacion(tecnico: string, adminJC: string, supervisor: string, nombrejc: string, nombrepc: string, inventario: string, causa: string)
    async Notificacion(body: any)//body: any
  {
    const adminJC = body.admin;
    const tecnico = body.tecnico;
    const causa = body.causa;
    const nombrejc = body.nombrejc;
    const nombrepc = body.nombrepc;
	const inventario = body.inventario;
    const supervisor = body.supervisor;
		
  await this.mailerService.sendMail({
    to: adminJC,
   	cc: supervisor,
    // from: '"Support Team" <support@example.com>', // override default from
    subject: 'Notificación de incidencia',
    template: './notificacion', // `.hbs` extension is appended automatically
    context: { // ✏️ filling curly brackets with content
      adminJC, tecnico, supervisor, nombrejc, nombrepc, inventario, causa //causa, nombrejc, supervisor
    },
  });
  console.log('El correo fue enviado servicio');
  }


  /*async sendUserConfirmation(user: Usuario, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.nombre,
        url,
      },
    });
  }*/


  
  //async NotificacionContrasena(admin: string, tecnico: string/*, nombrepc: string, nombrejc: string, supervisor: string, causa: string*/) {
  //  await this.mailerService.sendMail({
  //    to: admin,
      // from: '"Support Team" <support@example.com>', // override default from
  //    subject: 'Welcome to Nice App! Confirm your Email',
  //    template: './welcome', // `.hbs` extension is appended automatically
  //    context: { // ✏️ filling curly brackets with content
  //      admin,
  //      tecnico,
  //      nombrepc,
  //      nombrejc,
  //      supervisor,
  //      causa
  //    },
  //  });
//  }
}
