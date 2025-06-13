DELETE FROM public.usuario WHERE email = 'j@gmail.com'; -- Elimina el existente si hay

  INSERT INTO public.usuario (
  "nombre", "apellidos", "email", "password", 
  "grupo_municipal", "activo", "createdAt", "updatedAt", "rolId", "jcId"
) VALUES (
  'Jorge', 'Sanchez', 'j@example.com', 
  '$2b$10$Cbfz1X7PSPQVQU/nd8T1IOLaN48Nny3vYYT.7szbwUheMjIVhgntK',
  true, true, NOW(), NOW(), 1, 1
);

 UPDATE usuario
SET password = '$2b$10$sC4VRjngXnwJ8rUZcX1V6ObXWJVKmxl1rtuNsFQJgfMbXXBeba1fe'
WHERE email = 'j@example.com';


SELECT 
    email, 
    password, 
    LENGTH(password) AS hash_length 
FROM usuario 
WHERE email = 'j@example.com';