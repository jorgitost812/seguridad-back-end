import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
<<<<<<< HEAD
import helmet from 'helmet';
=======
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
>>>>>>> master

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Registrar Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(helmet());

  // Add global ClassSerializerInterceptor
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get('Reflector')),
  );

  // Global ValidationPipe with strict validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true, // Stop validation at first error
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Security API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // CORS Configuration from Environment Variables
  const corsOriginsEnv = configService.get<string>(
    'CORS_ORIGINS',
    'http://localhost:8080',
  );
  const corsOrigins = corsOriginsEnv.split(',').map((o) => o.trim());
  const corsCredentials = configService.get<boolean>('CORS_CREDENTIALS', true);

  app.enableCors({
<<<<<<< HEAD
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
=======
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
>>>>>>> master
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
