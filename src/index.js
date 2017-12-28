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

  const tables = config.tables || ['bots', 'users', 'channels', 'teams'] // Set defaults
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
    get: (id) => {
      return new Promise((resolve, reject) => {
        base.select({ filterByFormula: `id = '${id}'` }).firstPage(function (err, records) {
          if (err) return reject(err)
          return resolve(records[0])
        })
      })
    },
    lookup: (field, value) => {
      return new Promise((resolve, reject) => {
        if (!field) return reject(new Error('Requires a field for lookup'))
        if (!value) return reject(new Error('Requires a value to lookup'))
        if ((typeof field !== 'string')) return reject(new Error('Lookup field must be string'))
        base.select({ filterByFormula: `${field} = '${value}'` }).firstPage(function (err, records) {
          if (err) return reject(err)
          return resolve(records[0])
        })
      })
    },
    save: (object) => {
      return new Promise((resolve, reject) => {
        if (!object.id) return reject(new Error('The given object must have an id propery'))
        const { id, ...updateObject } = object
        base.select({ filterByFormula: `id = '${id}'` }).firstPage(function (err, records) {
          if (err) return reject(err)
          if (records[0]) {
            base.update(records[0].getId(), updateObject, function (err, record) {
              if (err) return reject(err)
              return resolve(record)
            })
          } else {
            base.create(object, function (err, record) {
              if (err) return reject(err)
              return resolve(record)
            })
          }
        })
      })
    },
    destroy: (id) => {
      return new Promise((resolve, reject) => {
        base.destroy(id, function (err, record) {
          if (err) return reject(err)
          return resolve(record)
        })
      })
    },
    all: () => {
      return new Promise((resolve, reject) => {
        let all = []
        base.select({
          maxRecords: 100,
        }).eachPage(function page (records, fetchNextPage) {
          all = [all, ...records]
          fetchNextPage()
        }, function done (err) {
          if (err) return reject(err)
          return resolve(all)
        })
      })
    }
  }
}
