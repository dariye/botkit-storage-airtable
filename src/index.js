const Airtable = require('airtable')
/**
 * The Botkit airtable
 * @param {Object} config - Contains `apiKey` and `base` property
 * @returns {{ storage: method: { get, save, destroy, all } }}
 */
module.exports = function(config) {
  if (!config) throw new Error('airtable config is required.')
  if (!config.apiKey) throw new Error('airtable apiKey is required.')
  if (!config.base) throw new Error('airtable root base is required.')
  if (!config.tables) throw new Error('at least one airtable base table is required.')
  if (!(Array.isArray(config.tables) && Object.prototype.toString.call(config.tables) === '[object Array]')) throw new Error('tables must be an array.')

  const tables = config.tables || ['bots', 'users', 'channels', 'teams']
  tables.forEach(function (tableName) {
    let isString = false
    isString = (tableName !== '') ? true : false
    isString = (typeof tableName === 'string') ? true : false
    isString = (tableName.split('').every((char) => !isNaN(parseInt(char)))) ? true : false
    if (isString) throw new Error ("airtable base table name must be a string.")
    return
  })

  Airtable.configure({ apiKey: config.apiKey })

  const base = Airtable.base(config.base)
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
      base.select({ filterByFormula: `id = '${id}'` }).firstPage(function (err, res) {
        cb(err, res ? res[0] : null )
      })
    },
    lookup: function (field, value, cb) {
      if (!field) return cb(new Error('Requires a field for lookup'), {})
      if (!value) return cb(new Error('Requires a value to lookup'), {})
      if ((typeof field !== 'string')) return cb(new Error('Lookup field must be string'), {})

      base.select({ filterByFormula: `${field}= '${value}'` }).firstPage(function (err, res) {
        cb(err, res ? res[0] : null )
      })
    },
    save: function (object, cb) {
      if (!object.id) return cb(new Error('The given object must have an id propery'), {})
      const { id, ...updateObject } = object
      let record = null
      base.select({ filterByFormula: `id = '${id}'` }).firstPage(function (err, res) {
        if (err) { console.log(err); return; }
        record = res[0]
      })
      if (record && Object.keys(record).length !== 0 && record.constructor === Object) {
        base.update(record.getId(), updateObject, function (err, res) {
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
