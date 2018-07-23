/* global describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import getApiRequestVersion from '../api/routes/utils/util';

process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('Get version number', () => {
  it('should get version number from request path', () => {
    const versionNumber = getApiRequestVersion('/api/v1/entries');
    versionNumber.should.be.a('string');
    versionNumber.should.eql('v1');
  });
});
