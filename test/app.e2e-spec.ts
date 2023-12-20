import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';

// whatever the things in main.ts should implment here to test

describe('App e2e', () => {

  let app: INestApplication; // abstract the app
  let prisma: PrismaService; // use dependency injection to get DB

  beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = moduleRef.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        }),
      );
      await app.init();
      await app.listen(3334); // providing server for pectum

      prisma = app.get(PrismaService);
      await prisma.cleanDb(); // clean DB
      pactum.request.setBaseUrl('http://localhost:3334');
  });

  afterAll(() => {
    app.close()       // after all testings
  })

  // it.todo('should pass');

  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'abc@gmail.com',
      password: '123',
    }

    
    describe('Signup', () => {

        // error without email
        it('should throw if email empty', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              password: dto.password,
            })
            .expectStatus(400);
        });

        // error without password
        it('should throw if password empty', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              email: dto.email,
            })
            .expectStatus(400);
        });

        // error when not have a body
        it('should throw if no body provided', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .expectStatus(400);
        });
        
        // success signup
        it('should signup', () => {
          return pactum
            .spec()
            .post(
              '/auth/signup',                           // root taken from base url
            )
            .withBody(dto)
            .expectStatus(201);
            // .inspect();
        });
    });

    // sign-in end point testing
    describe('Signin', () => {

      // error without email
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      // error without password
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      // error when not have a body
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin',
          )
          .withBody(dto)
          .expectStatus(200);
          // .inspect();
      });

    });

  });

  describe('User', () => {

    describe('Get me', () => {});

    describe('Edit user', () => {});

  });

  describe('Bookmarks', () => {

    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});

  });

});