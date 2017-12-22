// Test Airtable Base can be cloned here: https://airtable.com/shrFPznwWrSKsCZXZ
const should = require('should')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
require('should-sinon');


describe('Airtable', function () {
  let airtableMock, baseMock, tableMock, rootBaseMock, Storage

  beforeEach(function () {

    baseMock = {
      configure: sinon.stub(),
      base: sinon.stub()
    }

    tableMock = {
      base: sinon.stub().returns(baseMock),
      get: sinon.stub(),
      save: sinon.stub(),
      destroy: sinon.stub(),
      all: sinon.stub()
    }

    rootBaseMock = {
      configure: sinon.stub(),
      base: sinon.stub().returns(tableMock)
    }

    airtableMock = sinon.stub().returns(rootBaseMock)

    Storage = proxyquire('../src/index', {
      airtable: airtableMock
    })
  })

  describe('init', function () {

    it('should require a config', function () {
      Storage.should.throw('airtable config is required.')
    })

    it('should require an airtable apiKey', function () {
      (() => { Storage({}) }).should.throw('airtable apiKey is required.')
    })

    it('should require an airtable base', function () {
      (() => { Storage({ apiKey: 'arandomapikey' }) }).should.throw('airtable root base is required.')
    });

    it('should require airtable tables', function () {
      (() => { Storage({ apiKey: 'arandomapikey', base: 'groot' }) }).should.throw('at least one airtable base table is required.')
    });

    it('should require that airtable tables is array', function () {
      (() => { Storage({ apiKey: 'arandomapikey', base: 'groot', tables: 'string'}) }).should.throw('tables must be an array.')
    });

    it('should require that airtable base table name is of type "string"', function () {
      (() => { Storage({ apiKey: 'arandomapikey', base: 'groot', tables: ['1']}) }).should.throw('airtable base table name must be a string.')
    });

    it('should have expected config key:value', function () {
      const config = {
        apiKey: 'somerandomasskey',
        base: 'groot',
        tables: ['tablu']
      }
      Storage(config)
      config.should.have.property('apiKey', config.apiKey)
      config.should.have.property('base', config.base)
      config.should.have.property('tables', config.tables)
      config.should.have.property('tables', config.tables).which.is.a.Array()
    })

    it('should initialize with config', function () {
      const config = {
        apiKey: 'somerandomasskey',
        base: 'groot',
        tables: ['tablu']
      }
      Storage(config)
      airtableMock.callCount.should.equal(1)
    })
  });

  // ['bots', 'users', 'teams', 'companies', 'memberships', 'checkins', 'sprints'].forEach(function (method) {
  //   describe(method, function () {
  //     let records, record, config
  //
  //     beforeEach(() => {
  //       config = { apiKey: 'arandomapikey', base: 'anairtablebase', tables: [method] }
  //       record = {}
  //       records = {
  //         base: sinon.stub().returns(record)
  //       }
  //     });
  //
  //     it('should find records', () => {
  //       const cb = sinon.stub()
  //       baseMock.base.callsArgWith(1, records)
  //
  //       Storage(config)[method].get('randomish', cb)
  //       baseMock.base.onFirstCall.returns().should.equal('value')
  //       records.base.should.be.called
  //       // cb.should.be.calledWith(null, record)
  //     });
  //
  //     it('should call callback on error', () => {
  //       const cb = sinon.stub()
  //       const err = new Error('darn')
  //       tableMock.find.callsArgWith(1, err)
  //       Storage(config)[method].get('randomish', cb)
  //       tableMock.find.firstCall.args[0].should.equal('randomish')
  //       records.val.should.be.called
  //     });
  //   });
  //
  //   describe('create', () => {
  //     let config
  //
  //     beforeEach(() => {
  //       config = { apiKey: 'arandomapikey', base: 'anairtablebase'}
  //     })
  //
  //     it('should call airtable create', function () {
  //       const cb = sinon.stub()
  //       const object = { id: 'randomish' }
  //
  //       Storage(config)[method].create(object, cb)
  //       tableMock.create.should.be.calledWith(object, cb)
  //     })
  //   })
  // });
});
