/* global describe, it,before */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';

const should = chai.should();

process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('Entries', () => {
  const tokenObjec = {};
  before((done) => {
    const user = {
      email: 'test9@gmail.com',
      password: 'test123',
    };
    chai.request(server)
      .post('/auth/login')
      .send(user)
      .end((err, res) => {
        tokenObjec.token = res.body.token;
        done();
      });
  });
  describe('POST api/v1/entries', () => {
    it('should generate token', (done) => {
      tokenObjec.should.be.a('object');
      tokenObjec.should.have.property('token').not.eql('');
      done();
    });

    it('Should create a single entry on api/v1/entries returns status code 200', (done) => {
      const entry = {
        token: tokenObjec.token,
        title: 'The man',
        body: 'It happened yesteday',
      };
      chai.request(server)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, req) => {
          req.should.have.status(200);
          req.body.should.be.a('object');
          req.body.should.have.property('createdEntry').be.a('object');
          req.body.createdEntry.should.have.property('title').not.eql('');
          req.body.createdEntry.should.have.property('id').be.a('number');
          req.body.should.have.property('message').eql('success');
          done(err);
        });
    });

    it('Should not create entry when title field is missing', (done) => {
      // body field is missing, no entry will be created
      const entry = {
        token: tokenObjec.token,
        body: 'That is it',
      };
      chai.request(server)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, req) => {
          req.should.have.status(400);
          req.body.should.be.a('object');
          done(err);
        });
    });

    it("Should not create entry when request token didn't match", (done) => {
      // body field is missing, no entry will be created
      const entry = {
        token: 'xpnjsdnvjfnvjfdnvjnfdvjnfvjnvjfdnvjfnvj',
        body: 'That is it',
      };
      chai.request(server)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, req) => {
          req.should.have.status(401);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('Failed to authenticate');
          done(err);
        });
    });
  });

  describe('GET /api/v1/entries', () => {
    it('Should list all diary entry on /api/v1/entries', (done) => {
      chai.request(server)
        .get('/api/v1/entries')
        .set({ page: 1, perpage: 5 })
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('entries').be.a('array');
          res.body.should.have.property('message').eql('success');
          done();
        });
    });
  });

  describe('GEt /api/entries/:id', () => {
    it('Should not get a book with id not equall to request id', (done) => {
      const id = 100;
      chai.request(server)
        .get(`/api/v1/entries/${id}`)
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.property('message').eql('error');
          done();
        });
    });

    it('Should get a single diary entry on api/v1/entries/:id status code 200', (done) => {
      const id = 1;
      chai.request(server)
        .get(`/api/v1/entries/${id}`)
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('success');
          done();
        });
    });
  });

  describe('PUT api/v1/entries/:id', () => {
    it('Should modify an entry on api/v1/entries/ returns status code 200', (done) => {
      const id = 1;
      const entry = {
        token: tokenObjec.token,
        title: 'The man',
        body: 'It happened yesteday',
      };
      chai.request(server)
        .put(`/api/v1/entries/${id}`)
        .send(entry)
        .end((err, req) => {
          req.should.have.status(200);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('success');
          done(err);
        });
    });

    it('Should not modify an entry on api/v1/entries/:id returns status code 404', (done) => {
      const id = 30;
      const entry = {
        token: tokenObjec.token,
        title: 'The man',
        body: 'It happened yesteday',
      };
      chai.request(server)
        .put(`/api/v1/entries/${id}`) // tying to update not found
        .send(entry)
        .end((err, req) => {
          req.should.have.status(404);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('error');
          done(err);
        });
    });

    it('Should not modify an entry on api/v1/entries/:id returns status code 422', (done) => {
      const id = 1;
      const entry = {
        token: tokenObjec.token,
        body: 'It happened yesteday',
      };
      chai.request(server)
        .put(`/api/v1/entries/${id}`)
        .send(entry) // tying to update entry with empty value
        .end((err, req) => {
          req.should.have.status(422);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('failed');
          done(err);
        });
    });
  });

  describe('DELETE /api/v1/entries/:id', () => {
    it('Should not delete an entry returns status code 404', (done) => {
      const id = 20;
      chai.request(server)
        .delete(`/api/v1/entries/${id}`)
        .send({ token: tokenObjec.token })
        .end((err, req) => {
          req.should.have.status(404);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('failed');
          done(err);
        });
    });

    it('Should delete an entry returns status code 200', (done) => {
      const id = 1;
      chai.request(server)
        .delete(`/api/v1/entries/${id}`)
        .send({ token: tokenObjec.token })
        .end((err, req) => {
          req.should.have.status(200);
          req.body.should.be.a('object');
          req.body.should.have.property('message').eql('success');
          done(err);
        });
    });
  });
});
