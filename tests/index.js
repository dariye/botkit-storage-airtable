// Test Airtable Base can be cloned here: https://airtable.com/shrFPznwWrSKsCZXZ
const should = require('should')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
require('should-sinon');

describe('Airtable', () => {
  let airtableMock, fieldMock, rootBaseMock, baseMock, Storage

  beforeEach(function() {
    fieldMock = {
      find: sinon.stub()
    }

    baseMock = {
      field: sinon.stub().returns(fieldMock)
    }

    rootBaseMock = {
      field: sinon.stub().returns(baseMock)
    }

    airtableMock = sinon.stub().returns(rootBaseMock)

    Storage = proxyquire('../src/index', {
        airtable: airtableMock
    })
  })

  describe('init', () => {
    it('should require a config', () => {
      Storage.should.throw('airtable config is required.')
    })
    it('should require an airtable apiKey', () => {
      (() => { Storage({}) }).should.throw('airtable apiKey is required.')
    })
    it('should require an airtable base', () => {
      (() => { Storage({ apiKey: 'arandomapikey' }) }).should.throw('airtable root base is required.')
    });
  });

  ['bots', 'users', 'teams', 'companies', 'memberships', 'checkins', 'sprints'].forEach((method) => {
    describe('find', () => {
      let records, record, config

      beforeEach(() => {
        config = { apiKey: 'arandomapikey', base: 'anairtablebase'}
        record = {}
        records = {
          val: sinon.stub().returns(record)
        }
      });

      it('should find records', () => {
        const cb = sinon.stub()
        fieldMock.find.callsArgWith(1, records)
        Storage(config)[method].find('randomish', cb)
        fieldMock.find.firstCall.args[0].should.equal('value')
        records.val.should.be.called
        cb.should.be.calledWith(null, record)
      });
    });
  });

  // ['bots', 'users', 'teams', 'companies', 'memberships', 'checkins', 'sprints'].forEach((method) => {
  //   describe('get', function() {
  //       var records,
  //           record,
  //           config;
  //
  //       beforeEach(function() {
  //           config = {firebase_uri: 'right_here'};
  //
  //           record = {};
  //           records = {
  //               val: sinon.stub().returns(record)
  //           };
  //       });
  //
  //
  //       it('should get records', function() {
  //           var cb = sinon.stub();
  //           childMock.once.callsArgWith(1, records);
  //
  //           Storage(config)[method].get('walterwhite', cb);
  //           childMock.once.firstCall.args[0].should.equal('value');
  //           records.val.should.be.called;
  //           cb.should.be.calledWith(null, record);
  //       });
  //
  //       it('should call callback on error', function() {
  //           var cb = sinon.stub(),
  //               err = new Error('OOPS');
  //
  //           childMock.once.callsArgWith(2, err);
  //
  //           Storage(config)[method].get('walterwhite', cb);
  //           childMock.once.firstCall.args[0].should.equal('value');
  //           records.val.should.not.be.called;
  //           cb.should.be.calledWith(err);
  //       });
  //   });
  //
  //   describe('save', function() {
  //       var config;
  //
  //       beforeEach(function() {
  //           config = {firebase_uri: 'right_here'};
  //       });
  //
  //       it('should call firebase update', function() {
  //           var cb = sinon.stub(),
  //               data = {id: 'walterwhite'},
  //               updateObj = {walterwhite: data};
  //
  //           Storage(config)[method].save(data, cb);
  //           refMock.update.should.be.calledWith(updateObj, cb);
  //       });
  //   });
  //
  //   describe('all', function() {
  //
  //       var records,
  //           record,
  //           config;
  //
  //       beforeEach(function() {
  //           config = {firebase_uri: 'right_here'};
  //
  //           record = {
  //               'walterwhite': {id: 'walterwhite', name: 'heisenberg'},
  //               'jessepinkman': {id: 'jessepinkman', name: 'capncook'}
  //           };
  //
  //           records = {
  //               val: sinon.stub().returns(record)
  //           };
  //       });
  //
  //       it('should get records', function() {
  //           var cb = sinon.stub(),
  //               result = [record.walterwhite, record.jessepinkman];
  //
  //           refMock.once.callsArgWith(1, records);
  //
  //           Storage(config)[method].all(cb);
  //           refMock.once.firstCall.args[0].should.equal('value');
  //           records.val.should.be.called;
  //           cb.should.be.calledWith(null, result);
  //       });
  //
  //       it('should handle no records', function() {
  //           var cb = sinon.stub();
  //
  //           records.val.returns(undefined);
  //           refMock.once.callsArgWith(1, records);
  //
  //           Storage(config)[method].all(cb);
  //           refMock.once.firstCall.args[0].should.equal('value');
  //           records.val.should.be.called;
  //           cb.should.be.calledWith(null, []);
  //       });
  //
  //       it('should call callback on error', function() {
  //           var cb = sinon.stub(),
  //               err = new Error('OOPS');
  //
  //           refMock.once.callsArgWith(2, err);
  //
  //           Storage(config)[method].all(cb);
  //           refMock.once.firstCall.args[0].should.equal('value');
  //           records.val.should.not.be.called;
  //           cb.should.be.calledWith(err);
  //       });
  //   });
  // });
});
