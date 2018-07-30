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
});
