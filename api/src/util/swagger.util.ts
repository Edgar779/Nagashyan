import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerUtil {
  setup = (app) => {
    const options = new DocumentBuilder()
      .setTitle('Menuz API')
      .setVersion('1.0.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/api-doc', app, swaggerDocument);
  };
}
