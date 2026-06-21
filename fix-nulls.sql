-- Rellenar NULLs en columnas NOT NULL antes de synchronize
-- Ejecutar contra DB "seguridad"

-- municipio
UPDATE municipio SET nombre = 'Sin nombre' WHERE nombre IS NULL;

-- provincia
UPDATE provincia SET nombre = 'Sin nombre' WHERE nombre IS NULL;

-- computadora
UPDATE computadora SET nombre = 'Sin nombre' WHERE nombre IS NULL;
UPDATE computadora SET numero = '0' WHERE numero IS NULL;
UPDATE computadora SET ip = '0.0.0.0' WHERE ip IS NULL;

-- c_accesos
UPDATE c_accesos SET nombrejc = 'Sin JC' WHERE nombrejc IS NULL;
UPDATE c_accesos SET nombrepc = 'Sin PC' WHERE nombrepc IS NULL;
UPDATE c_accesos SET tecnico = 'Sin tecnico' WHERE tecnico IS NULL;
UPDATE c_accesos SET supervisor = 'Sin supervisor' WHERE supervisor IS NULL;
UPDATE c_accesos SET causa = 'Sin causa' WHERE causa IS NULL;
UPDATE c_accesos SET inventario = 'Sin inventario' WHERE inventario IS NULL;

-- jclub
UPDATE jclub SET nombre = 'Sin nombre' WHERE nombre IS NULL;

-- usuario
UPDATE usuario SET nombre = 'Sin nombre' WHERE nombre IS NULL;
UPDATE usuario SET apellidos = 'Sin apellido' WHERE apellidos IS NULL;
UPDATE usuario SET email = 'unknown@example.com' WHERE email IS NULL;
UPDATE usuario SET password = '$2b$10$placeholder' WHERE password IS NULL;

-- rol
UPDATE rol SET nombre = 'Sin nombre' WHERE nombre IS NULL;

-- funcionesrol
UPDATE funcionesrol SET nombre = 'Sin nombre' WHERE nombre IS NULL;

-- trazas
UPDATE trazas SET usuario_email = 'unknown' WHERE usuario_email IS NULL;
UPDATE trazas SET usuario_rol = 'unknown' WHERE usuario_rol IS NULL;
UPDATE trazas SET accion = 'UNKNOWN' WHERE accion IS NULL;
UPDATE trazas SET entidad = 'unknown' WHERE entidad IS NULL;

-- ini_sesion
UPDATE ini_sesion SET email = 'unknown@example.com' WHERE email IS NULL;
