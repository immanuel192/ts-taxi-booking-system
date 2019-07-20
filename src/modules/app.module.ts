import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GlobalModule } from './global.module';
import { MwGracefulShutdown, MwRequestLogger } from '../middlewares';
import { providerErrorFilter, providerGlobalValidation } from '../providers';

@Module({
  imports: [
    GlobalModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'basic', property: 'profile' }),
  ],
  controllers: [
  ],
  providers: [
    providerErrorFilter,
    providerGlobalValidation
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MwGracefulShutdown).forRoutes('/');
    consumer.apply(MwRequestLogger).forRoutes('/');
  }
}
