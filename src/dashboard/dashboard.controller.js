import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { SETTINGS } from '../../app.utils';
//import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
//import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('api/dashboard')
//@ApiBearerAuth()
//@ApiTags('usuarios')
export class TotalesController {
  constructor(private usuarioService: UsuariosService) {}
    @Get()
    getAll(){
        return this.usuarioService.findAll();
    }

    
    
}
