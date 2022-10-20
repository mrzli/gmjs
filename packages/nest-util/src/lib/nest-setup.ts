import { INestApplication, LoggerService } from "@nestjs/common";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

export interface NestAppSetupOptions {
  readonly globalPrefix: string;
}

export interface NestAppBootstrapOptions {
  readonly port: number;
  readonly globalPrefix: string;
}

export async function bootstrapNestApp(
  app: INestApplication,
  logger: LoggerService,
  options: NestAppBootstrapOptions
): Promise<void> {
  const { port, globalPrefix } = options;

  setupNestApp(app, { globalPrefix });
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

export function setupNestApp(
  app: INestApplication,
  options: NestAppSetupOptions
): void {
  const { globalPrefix } = options;

  // app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.use(cookieParser());
}