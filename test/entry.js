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
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.above(0);
          done();
        });
    });
  });
});
