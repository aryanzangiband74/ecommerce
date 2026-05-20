import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { HttpExceptionFilter } from './common/exceptions/http.exceptions'
import { LoggerMiddleware } from './logger/logger.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // app.useGlobalGuards(new JwtAuthGuard())
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Ecommerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  app.use(new LoggerMiddleware().use)
  app.useGlobalFilters(new HttpExceptionFilter())
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
