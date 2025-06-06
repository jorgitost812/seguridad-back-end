
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent
  } from 'typeorm';
  import { Usuario } from './entities/usuario.entity';
  import * as bcrypt from 'bcrypt';
  
  @EventSubscriber()
  export class UsuarioSubscriber implements EntitySubscriberInterface<Usuario> {
    constructor(connection: Connection) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return Usuario;
    }
  
    async beforeInsert(event: InsertEvent<Usuario>) {
      return event.entity.password = await bcrypt.hash(event.entity.password, 10);
    }
    async beforeUpdate(event: UpdateEvent<Usuario>) {
      if (event.entity.password){
        return event.entity.password = await bcrypt.hash(event.entity.password, 10);
      } else {
        return
      }
    }

  }
  