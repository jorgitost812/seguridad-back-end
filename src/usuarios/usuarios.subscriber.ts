// import {
//   Connection,
//   EntitySubscriberInterface,
//   EventSubscriber,
//   InsertEvent,
//   UpdateEvent
// } from 'typeorm';
// import { Usuario } from './entities/usuario.entity';
// import * as bcrypt from 'bcrypt';

// @EventSubscriber()
// export class UsuarioSubscriber implements EntitySubscriberInterface<Usuario> {
//   constructor(connection: Connection) {
//     connection.subscribers.push(this);
//   }

//   listenTo() {
//     return Usuario;
//   }

//   async beforeInsert(event: InsertEvent<Usuario>) {
//     console.log('Before Insert - Original password:', event.entity.password);
//     if (event.entity.password) {
//       const hashedPassword = await bcrypt.hash(event.entity.password, 10);
//       console.log('Before Insert - Hashed password:', hashedPassword);
//       event.entity.password = hashedPassword;
//     }
//   }

//   async beforeUpdate(event: UpdateEvent<Usuario>) {
//     // Verificar si el entity existe y si tiene password
//     if (event.entity && 'password' in event.entity && event.entity.password) {
//       // Solo hashear si el password fue modificado
//       const hashedPassword = await bcrypt.hash(event.entity.password, 10);
//       event.entity.password = hashedPassword;
//       console.log('Before Update - Password hashed');
//     }
//   }
// }