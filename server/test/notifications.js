/* global describe, it, before */
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../server';

const should = chai.should();

process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('Reminder Settings', () => {
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

  describe('GET /api/v1/settings/notifications', () => {
    it('Should get user reminder settings /api/v1/settings/notifications', (done) => {
      chai.request(server)
        .get('/api/v1/settings/notifications')
        .send({ token: tokenObjec.token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('notifications').be.a('array');
          res.body.should.have.property('status').eql('Success');
          done();
        });
    });
  });

  describe('GET /api/v1/settings/notifications', () => {
    it('Should update reminder settings /api/v1/settings/notifications', (done) => {
      chai.request(server)
        .put('/api/v1/settings/notifications')
        .send({
          token: tokenObjec.token,
          title: 'journal',
          reminder: false,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('updatedNotification').be.a('object');
          res.body.updatedNotification.should.have.property('title').eql('journal');
          res.body.should.have.property('status').eql('Success');
          done();
        });
    });

    it('Should not update reminder settings when title or reminder params is missing', (done) => {
      chai.request(server)
        .put('/api/v1/settings/notifications')
        .send({
          token: tokenObjec.token,
          reminder: false,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Title is required');
          res.body.should.have.property('status').eql('Failed');
          done();
        });
    });
  });
});
