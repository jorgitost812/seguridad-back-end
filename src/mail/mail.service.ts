import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(xxX: string, tecnico: string) {
    await this.mailerService.sendMail({
      to: 'luis.guerra@ltu.jovenclub.cu',
      subject: 'Bienvenido a nuestra aplicación!',
      template: './welcome',
      context: {
        xxX,
        tecnico,
      },
    });
  }

  async Notificacion(body: any) {
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
      subject: 'Notificación de incidencia',
      template: './notificacion',
      context: {
        adminJC,
        tecnico,
        supervisor,
        nombrejc,
        nombrepc,
        inventario,
        causa,
      },
    });
    this.logger.log('Correo de notificación enviado');
  }
}
