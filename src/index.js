const Airtable = require('airtable')
/**
 * The Botkit airtable
 * @param {Object} config - Contains `apiKey` and `base` property
 * @returns {{ storage: {{ get, save, destroy, all }} }}
 */
module.exports = function(config) {
  if (!config) throw new Error('airtable config is required.')
  if (!config.apiKey) throw new Error('airtable apiKey is required.')
  if (!config.base) throw new Error('airtable root base is required.')
  if (!config.tables) throw new Error('at least one airtable base table is required.')
  if (!(Array.isArray(config.tables) && Object.prototype.toString.call(config.tables) === '[object Array]')) throw new Error('tables must be an array.')

  const tables = config.tables || ['bots', 'users', 'teams']
  tables.forEach(function (tableName) {
    let isString = false
    isString = (tableName !== '') ? true : false
    isString = (typeof tableName === 'string') ? true : false
    isString = (tableName.split('').every((char) => !isNaN(parseInt(char)))) ? true : false
    if (isString) throw new Error ("airtable base table name must be a string.")
    return
  })

  const base = function () {
    return new Airtable({ apiKey: config.apiKey }).base(config.base)
  }
  
  const storage = {}

  tables.forEach(function (table, idx) {
    storage[table] = getStorageObject(base(table))
  })

  return storage
};

/**
 * Function to generaate storage object for a given Airtable base
 * @param {Object} base The Airtable table base
 * @returns {{ get, save, destroy, all }}
 */

function getStorageObject(base) {
  return {
    get: function (id, cb) {
      base.find(id,  function (err, res) {
        cb(err, res ? res : null )
      })
    },
    save: function (object, cb) {
      if (!object.id) return cb(new Error('The given object must have an id propery'), {})
      const { id, ...updateObject } = object
      let record = null
      base.find(id, function (err, res) {
        if (err) { console.log(err); return; }
        record = res
      })
      if (record) {
        base.update(id, updateObject, function (err, res) {
          if (err) { console.log(err); return; }
          cb(err, res ? res : null)
        })
      } else {
        base.create(object, function (err, res) {
          if (err) { console.log(err); return; }
          cb(err, res ? res : null)
        })
      }
    },
    destroy: function (id, cb) {
      base.destroy(id, function (err, res) {
        if (err) { console.log(err); return; }
        cb(err, res ? res : null)
      })
    },
    all: function (cb) {
      let records = null
      base.select({
        maxRecords: 100,
      }).eachPage(function page (res, fetchNextPage) {
        records = [records, ...res]
        fetchNextPage()
      }, function done (err) {
        if (err) { console.log(err); return }
        cb(err, records ? records : null)
      })
    }
  }
}

/**
 * Given an airtable `table`, will return a function that will find a single record
 *
 * @param {Object} `base` - an airtable table
 * @returns {Function} - The find function
 */
function find(base) {
  return (id, cb) => {
    if (!id) throw new Error('find function requires an id')
    return base.find(id, (err, record) => {
      if (err) { console.log(err); return }
      return record
    })
  };
}

/**
 * Given an airtable base, will return a function that will create a record
 *
 * @param {Object} base - an airtable table
 * @returns {Function} - The create function
 */
function create(base) {
  return (object, cb) => {
    if (!object.id) throw new Error('create function requires a unique id for the object to be saved')
    return base.create(object, (err, record) => {
      if (err) { console.log(err); return }
      return record
    })
  }
}

/**
 * Given an airtable base, will return a function that will update a record
 *
 * @param {Object} base - an airtable table
 * @returns {Function} - The update function
 */
function update(base) {
  return (id, object, cb) => {
    if (!id) throw new Error('update function requires an id')
    if (!object) throw new Error('update function require a payload object')
    return base.update(id, object, (err, record) => {
      if (err) { console.log(err); return }
      return record
    })
  }
}

/**
 * Given an airtable base, will return all objects
 *
 * @param {Object} base A reference to the airtable table
 * @returns {Function} The destroy function
 */
function destroy(base) {
  return (id, cb) => {
    if (!id) throw new Error('destroy function requires an id')
    return base.destroy(id, (err, record) => {
      if (err) { console.log(err); return; }
      return record
    })
  }
}

/**
 * Given an airtable base, will return all objects
 *
 * @param {Object} base A reference to the airtable table
 * @returns {Function} The all function
 */

function all(base) {
  return (cb) => {
    const records = []
    return base.select({
        maxRecords: 100
    }).eachPage(function page (recs, fetchNextPage) {
      records = [records, ...recs]
      fetchNextPage()
    }, function done (err) {
      if (err) { console.log(err); return; }
      return records
    })
  }
}
