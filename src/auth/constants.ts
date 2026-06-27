import { ConfigService } from '@nestjs/config';

<<<<<<< HEAD
export const jwtConstants = {
    secret: process.env.JWT_SECRET,
  };
  
=======
export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET'),
});
>>>>>>> master
