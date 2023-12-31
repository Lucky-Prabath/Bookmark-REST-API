import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { authenticate } from 'passport';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
          .expectStatus(200)
          .stores('accessToken', 'access_token');
          // .inspect();
      });

    });

  });

  describe('User', () => {

    describe('Get me', () => {
      it('shoult get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('shoult edit user', () => {
        const dto: EditUserDto = {
          firstName: "testing",
          email: 'abc@gmail.com'
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });

  });

  describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectBody([]);
      })
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          link: 'http://www.youtube.com/watch?v=asdfsdf'
      };
      it("should create bookmark", () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      })
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200);
      })
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200);
      })
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'kubernetes full couse',
        description: 'sdfs asf asdfsf',
        link: 'asfaf'
      }
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(200);
      })
    });

    describe('Delete bookmark', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(204);
      })

      it('should get empty bookmarks after delete', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });

    });

  });

});