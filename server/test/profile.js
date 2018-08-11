/* global describe, it, before */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';

const should = chai.should();

process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('User Profile Details', () => {
  const tokenObjec = {};
  before((done) => {
    const user = {
      email: 'test999@gmail.com',
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

  describe('GET /api/v1/users/profile', () => {
    it('Should get user profile /api/v1/users/profile', (done) => {
      chai.request(server)
        .get('/api/v1/users/profile')
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user').be.a('object');
          res.body.user.should.have.property('email').eql('test999@gmail.com');
          res.body.should.have.property('status').eql('Success');
          done();
        });
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('Should get user tottal number of entries user has', (done) => {
      chai.request(server)
        .get('/api/v1/users/profile/entries')
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('entries').eql(0);
          done();
        });
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('Should update user profile /api/v1/users/profile', (done) => {
      chai.request(server)
        .put('/api/v1/users/profile')
        .send({
          token: tokenObjec.token,
          firstName: 'gozmanU',
          lastName: 'chigozie',
          email: 'test999@gmail.com',
          location: 'Lagos Nigeria',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user').be.a('object');
          res.body.user.should.have.property('first_name').eql('gozmanU');
          res.body.should.have.property('status').eql('Success');
          done();
        });
    });
  });
});
