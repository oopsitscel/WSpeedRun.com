import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Function for BigInt serialization
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('WSpeedRun - Run Service')
    .setDescription('API documentation for Run Catalog and Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
 console.log(`Run Service is running on: http://localhost:${port}/api`);
}
bootstrap();
