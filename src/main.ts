import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './presentation/http/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from './presentation/http/filters/app-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AppExceptionFilter());
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('JOB APPLICATION APIs')
    .setDescription('API documentation for My Job Application System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== 'Production') {
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
