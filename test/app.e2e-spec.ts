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
              name: 'ts-taxi-booking-system',
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

  describe('Booking', () => {
    describe('attempt booking', () => {
      it('when attempt booking without from then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({})
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/source should not be empty/);
          });
      });

      it('when attempt booking without to then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({ source: { x: 1, y: 2 } })
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/destination should not be empty/);
          });
      });

      it('when attempt booking without source.x then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({
            source: { x1: 1, y: 2 },
            destination: { x: 1, y: 2 }
          })
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/x must be an integer number/);
          });
      });

      it('when attempt booking without source.y then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({
            source: { x: 1, y1: 2 },
            destination: { x: 1, y: 2 }
          })
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/y must be an integer number/);
          });
      });

      it('when attempt booking without destination.x then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({
            source: { x: 1, y: 2 },
            destination: { x1: 1, y: 2 }
          })
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/x must be an integer number/);
          });
      });

      it('when attempt booking without destination.y then will throw exception', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({
            source: { x: 1, y: 2 },
            destination: { x: 1, y1: 2 }
          })
          .set('accept', 'json')
          .expect(400)
          .then((res) => {
            expect(JSON.stringify(res.body)).toMatch(/y must be an integer number/);
          });
      });

      it('when attempt booking will return result', () => {
        return request(app.getHttpServer())
          .post('/api/book')
          .send({
            source: { x: 0, y: 1 },
            destination: { x: 1, y: 1 }
          })
          .set('accept', 'json')
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              car_id: 1,
              total_time: 2
            });
          });
      });
    });
  });
});
