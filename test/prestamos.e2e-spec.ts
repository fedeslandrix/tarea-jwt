import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configurarApp } from '../src/app.setup';
import { Socio } from '@/socios/entities/socio.entity';
import { CrearLibroDto } from '@/libros/dto/crear-libro.dto';
import { Libro } from '@/libros/entities/libro.entity';


describe('Test api prestamos', () => {

    let app: INestApplication<App>

    let name1: string = "fede"
    let email1: string = "fede@gmail.com"
    let password1: string = "1234"
    let role1: string = "socio"
    let token1: string
    let user1: Socio

    let libro1Id: Libro
    let libro2Id: Libro


    let token2: string
    let user2: Socio

    beforeEach(async () => {
        const modulo = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = modulo.createNestApplication();
        configurarApp(app);
        await app.init();

        let res1 = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'lucas',
                email: 'jensenhuang@gmai.com',
                password: 'nvidia',
                role: 'socio'
            })
            .expect(201)

        token1 = res1.body.access_token
        user1 = res1.body.user

        let res_user2 = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'federico',
                email: 'nose@gmail.com',
                password: 'hola',
                role: 'bibliotecario'
            })

        user2 = res_user2.body.user
        token2 = res_user2.body.access_token

        let res2 = await request(app.getHttpServer())
        .post('/libros')
        .set(
            'Authorization',
            `Bearer ${token2}`
        )
        .send({
            titulo: 'Rayuela',
            autor: 'Julio Cortázar',
            isbn: '9788437604572',
            categoria: 'novela',
            anio: 1963,
            ejemplares: 2,

        }).expect(201)

        libro1Id = res2.body.id

        let res3 = await request(app.getHttpServer())
        .post('/libros')
        .set(
            'Authorization',
            `Bearer ${token2}`
        )
        .send({
            titulo: 'El Principio',
            autor: 'Alberto Fernandez',
            isbn: '1738437604972',
            categoria: 'cuento',
            anio: 1963,
            ejemplares: 2,

        }).expect(201)
        libro2Id = res3.body.id
        
    })

    afterEach(async () => {
        await app.close();
    });



    it('Pide prestado un libro', async ()=>{
        const res = await request(app.getHttpServer())
        .post('/prestamos')
        .set(
            'Authorization',
            `Bearer ${token1}`
        )
        .send({
            libroId: libro1Id,
            socioId: user1.id,
            dias: 5
        }).expect(201)
    })

    it('Usuario no autenticado pide prestado un libro', async ()=>{
        const res = await request(app.getHttpServer())
            .post('/prestamos')
            .send({
                libroId: libro1Id,
                socioId: user1.id,
                dias: 5
            })
            .expect(401);
    })

    it('Usuario pide ver el prestamo de otro', async ()=>{
        const res = await request(app.getHttpServer())
            .post('/prestamos')
            .set(
                'Authorization',
                `Bearer ${token1}`
            )
            .send({
                libroId: libro1Id,
                socioId: user1.id,
                dias: 5
            })
            .expect(201);

        const res2 = await request(app.getHttpServer())
            .get(`/prestamos/${libro1Id}`)
            .set(
                'Authorization',
                `Bearer ${token2}`
            )
            .expect(404)
    })


})