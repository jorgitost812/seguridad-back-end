SELECT u.id, u.nombre, u.apellidos, u.email, r.nombre as rol FROM usuario u LEFT JOIN rol r ON u."rolId" = r.id ORDER BY u.id;
