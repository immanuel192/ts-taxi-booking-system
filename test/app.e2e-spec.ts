import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/modules/app.module';
import { PROVIDERS } from '../src/commons';
import { NoopLogger } from '../src/commons/test-helper';
import * as request from 'supertest';

describe('/src/app.ts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule
      ]
    })
      .overrideProvider(PROVIDERS.ROOT_LOGGER)
      .useValue(NoopLogger)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Common', () => {
    describe('GET /health', () => {
      it('should return HTTP 200', () => {
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              name: 'nest-todo',
              version: expect.anything()
            });
          });
      });
    });

    describe('HEAD /health', () => {
      it('should return HTTP 200', () => {
        return request(app.getHttpServer())
          .head('/health')
          .expect(200);
      });
    });
  });
});
