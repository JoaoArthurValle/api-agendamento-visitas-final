"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: config.get('CORS_ORIGIN') ?? 'http://localhost:5173',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('API de Agendamento de Visitas')
        .setDescription('Sistema de agendamento que aceita visitas apenas em horário comercial (seg–sex, 09h–18h).')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.get('PORT') ?? 3004;
    await app.listen(port);
    console.log(`🚀 API rodando em http://localhost:${port}/api`);
    console.log(`📘 Swagger em      http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map