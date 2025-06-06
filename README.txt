DESCRIPCIÓN GENERAL
Este es un sistema informático de seguridad diseñado para la informatización del proceso de control de contraseñas basado en el sobre lacrado. Consta de dos aplicaciones: servidor y cliente, ambas implementadas con node js. El servidor fue programado con nest js y el cliente, con nuxt js.

DESPLEGANDO LA BASE DE DATOS
1. Abra una administrador de bases de datos de postgres (v.9.5)
2. Cree una base de datos llamada seguridad
3. Restaure los datos del archivo seguridad.backup
Nota: Si se presenta un error de llave primaria duplicada, probablemente se deba al valor actual de la secuencia definida para la tabla dada.

EJECUTANDO EL SERVIDOR
1. Abra una consola de comandos:
cmd
2. Diríjase a la carpeta donde se encuentra el servidor, por ejemplo:
cd C:\Users\Yorkapper\Desktop\project\seguridad-back-end
3. Inicie la aplicación:
npm run start:dev

EJECUTANDO EL CLIENTE
1. Abra una consola de comandos:
cmd
2. Diríjase a la carpeta donde se encuentra el servidor, por ejemplo:
cd C:\Users\Yorkapper\Desktop\project\seguridad-back-end\cc-fron
3. Inicie la aplicación:
npm run dev

INFORMACIÓN SOBRE LAS FUNCIONES DE LOS ROLES
El administrador (1):
- Gestiona los administradores provinciales
El administrador provincial (2)
- Gestiona los municipios de su provincia
El director municipal (3):
- Gestiona los joven club de su municipio
El responsable de seguridad informática (4):
- Gestiona las computadoras de su joven club
El supervisor (6)
- Se utiliza en la visualización de contraseñas como quien la autoriza
El técnico (7)
- Visualiza la contraseña
El usuario (8)
- Puede usar la información que ofrece el sistema, pero como un observador pasivo que no visualiza la contraseña