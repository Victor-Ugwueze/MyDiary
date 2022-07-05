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

  describe('GET /api/v1/users/profile/password, change user password', () => {
    it('Should change user password, with matched current password', (done) => {
      chai.request(server)
        .put('/api/v1/users/profile/password')
        .send({
          token: tokenObjec.token,
          currentPassword: 'test123',
          password: 'test1234',
          confirmPassword: 'test1234',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Password updated succesfully');
          res.body.should.have.property('status').eql('Success');
          done();
        });
    });

    it('Should not change user password when current password is wrong', (done) => {
      chai.request(server)
        .put('/api/v1/users/profile/password')
        .send({
          token: tokenObjec.token,
          currentPassword: 'test123',
          password: 'test1234',
          confirmPassword: 'test1234',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Wrong Password provided');
          res.body.should.have.property('status').eql('Failed');
          done();
        });
    });

    it('Should not change user password when password length is < 6', (done) => {
      chai.request(server)
        .put('/api/v1/users/profile/password')
        .send({
          token: tokenObjec.token,
          currentPassword: 'test1234',
          password: 'test',
          confirmPassword: 'test',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('password should be a minimum of 6 chracters');
          res.body.should.have.property('status').eql('Failed');
          done();
        });
    });
  });
});
