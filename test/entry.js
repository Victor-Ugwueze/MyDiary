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
          res.body.response.should.be.a('object');
          res.body.response.should.have.property('status');
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
          res.body.should.be.a('object');
          done();
        });
    });

    it('Should get a single diary entry on api/v1/entries/:id', (done) => {
      const id = 1;
      chai.request(server)
        .get(`/api/v1/entries/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.have.property('status').eql('ok');
          done();
        });
    });
  });
});
