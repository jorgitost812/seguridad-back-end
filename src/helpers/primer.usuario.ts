//const db = require('../models');
import { ProvinciasService } from '../provincias/services/provincias.service';

//import { Municipio } from '../municipios/entities/municipio.entity';
//import { Usuario } from '../usuarios/entities/usuario.entity';

const provincias = ['Pinar del rio', 'Artemisa', 'La habana', 'Mayabeque', 'Matanzas', 'Cienfuegos', 'Villa Clara', 'Santispiritud', 'Ciego de Avila', 'Camaguey', 'Las Tunas', 'Holguin', 'Granma', 'Santigo de Cuba', 'Guantanamo', 'Isla de la Juventud']
const municipios = ['Manatí', 'Puerto Padre', 'Jesús Menéndez', 'Majibacoa', 'Tunas', 'Jobabo', 'Colombia', 'Amancio']

const createFirstUser = async () => {
 
    /*if((await db.MunicipioModel.countDocuments({})) === 0){
      for (let i = 0; i < municipios.length; i++) {
        const mcpio = {
          nombre: municipios[i]
        }
        await db.MunicipioModel.create(mcpio);
      }
    }*/

    /*if((await db.JCModel.countDocuments({})) === 0){
      const mcpio = await db.MunicipioModel.findOne({nombre: 'Tunas'})
      const jc = {
        nombre: 'Tunas 1',
        municipio: mcpio._id
      }
      await db.JCModel.create(jc);
    }*/

    /*if((await db.UserModel.countDocuments({})) === 0){
      const mcpio = await db.MunicipioModel.findOne({nombre: 'Tunas'})
      const jc = await db.JCModel.find();
      const user = {
        firstName: 'Ivan',
        lastName: 'Rodríguez Álvares',
        email: 'ivan.rodriguez@ltu.jovenclub.cu',
        municipio: mcpio._id,
        jc: jc[0]._id,
        password: '12348765',
        roles: 'ADMIN'
      }
      await db.UserModel.create(user);
    }*/

	/*if((await db.PCModel.countDocuments({})) === 0){
      const mcpio = await db.MunicipioModel.findOne({nombre: 'Tunas'})
      const jc = await db.JCModel.find();
      const pc = {
        ninventario: '000000',
        nombre: 'miPC',
        passwordSetup: '123',
		passwordadmin: '456',
        jc: jc[0]._id        
      }
      await db.PCModel.create(pc);
    }
	} catch (e) {

   }*/
};

module.exports = createFirstUser;