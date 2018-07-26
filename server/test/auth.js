/* global describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';
// import User from '../models/user';

const should = chai.should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Authenticate User', () => {
  describe('POST /auth/signup', () => {
    it('It should signup user, and asing token', (done) => {
      const user = {
        firstName: 'gozman',
        lastName: 'The man',
        email: 'test9@gmail.com',
        password: 'test123',
        confirmPassword: 'test123',
      };
      chai.request(server)
        .post('/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('success');
          res.body.should.have.property('token').be.a('string');
          done();
        });
    });
    it('It should not signup user where eamil already exists, and asing token', (done) => {
      const user = {
        firstName: 'gozman',
        lastName: 'The man',
        email: 'test9@gmail.com',
        password: 'test123',
        confirmPassword: 'test123',
      };
      chai.request(server)
        .post('/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('email exist');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('It should login user, and asing token', (done) => {
      const user = {
        email: 'test9@gmail.com',
        password: 'test123',
      };
      chai.request(server)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('success');
          res.body.should.have.property('token').be.a('string');
          done();
        });
    });

    it('It should not login user, email field missing', (done) => {
      const user = {
        password: 'test123',
      };
      chai.request(server)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('error');
          res.body.errors[0].should.have.property('msg').eql('email is required');
          done();
        });
    });
    it('It should not login user, when password mismatch', (done) => {
      const user = {
        email: 'test9@gmail.com',
        password: 'test',
      };
      chai.request(server)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('error');
          done();
        });
    });
  });
});
