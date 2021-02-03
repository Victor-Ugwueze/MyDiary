/* global describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
// import User from '../models/user';

const should = chai.should();

process.env.NODE_ENV = 'test';


describe('Routes File', () => {
  describe('Route not found', () => {
    it('It should return e message, Resource not found', (done) => {
      chai.request(server)
        .get('/entries')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('sorry, page not found');
          done();
        });
    });
  });

  describe('GET /api-docs', () => {
    it('It should return documentation page', (done) => {
      chai.request(server)
        .get('/api-docs')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('It should return documentation page', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET /api/v1/entries', () => {
    it('Should return unatharised, whith no token on request', (done) => {
      chai.request(server)
        .get('/api/v1/entries')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});
