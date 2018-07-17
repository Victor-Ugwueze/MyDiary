/* global describe, it, describe */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/server';

const should = chai.should();

process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('Entries', () => {
  describe('GET /api/v1/entries', () => {
    it('Should list all diary entry on /api/v1/entries', (done) => {
      chai.request(server)
        .get('/api/v1/entries')
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
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.property('message').eql('error');
          done();
        });
    });

    it('Should get a single diary entry on api/v1/entries/:id status code 404', (done) => {
      const id = 1;
      chai.request(server)
        .get(`/api/v1/entries/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('success');
          done();
        });
    });
  });
  describe('POST api/v1/entries', () => {
    it('Should create a single entry on api/v1/entries returns status code 200', (done) => {
      const entry = {
        id: 3,
        title: 'The man',
        body: 'It happened yesteday',
      };
      chai.request(server)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, req) => {
          req.should.have.status(201);
          req.body.should.be.a('object');
          req.body.should.have.property('result').be.a('object');
          req.body.result.should.have.property('title').not.eql('');
          req.body.result.should.have.property('id').be.a('number');
          req.body.should.have.property('message').eql('success');
          done(err);
        });
    });

    it('Should not create an entry with tite field missing or empty, returns status code 200', (done) => {
      // body field is missing, no entry will be created
      const entry = {
        id: 3,
        body: 'That is it',
      };
      chai.request(server)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, req) => {
          req.should.have.status(200);
          req.body.should.be.a('object');
          req.body.should.have.property('errors');
          req.body.errors.should.have.property('fields');
          req.body.errors.fields.should.have.property('title').eql('title is required');
          done(err);
        });
    });
  });
});
