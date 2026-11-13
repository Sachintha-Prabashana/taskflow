import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createServer } from './server';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await createServer();
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 5000);

    await app.listen(port);
    logger.log(`TaskFlow API is running at: http://localhost:${port}/api/v1`);
  } catch (error) {
    logger.error('Failed to bootstrap TaskFlow API', error);
    process.exit(1);
  }
}

void bootstrap();
