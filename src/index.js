const Airtable = require('airtable')

/**
 * The Botkit airtable
 * @param {Object} config - Contains `apiKey` and `base` property
 * @returns {{
 *    bots: { find, create, update, destroy, all },
 *    users: { find, create, update, destroy, all },
 *    teams: { find, create, update, destroy, all },
 *    companies: { find, create, update, destroy, all },
 *    memberships: { find, create, update, destroy, all },
 *    checkins: { find, create, update, destroy, all },
 *    sprints: { find, create, update, destroy, all }
 *  }}
 */
module.exports = function(config) {
  if (!config) throw new Error('airtable config is required.')
  if (!config.apiKey) throw new Error('airtable apiKey is required.')
  if (!config.base) throw new Error('airtable root base is required.')

  const base = new Airtable({ apiKey: config.apiKey }).base(config.base),
    botsBase = base('bots'),
    usersBase = base('users')
    teamsBase = base('teams'),
    companiesBase = base('companies'),
    membershipsBase = base('memberships'),
    checkinsBase = base('checkins'),
    sprintsBase = base('sprints');

  return {
    bots: {
      find: find(botsBase),
      create: create(botsBase),
      update: update(botsBase),
      destroy: destroy(botsBase),
      all: all(botsBase)
    },
    users: {
      find: find(usersBase),
      create: create(usersBase),
      update: update(usersBase),
      destroy: destroy(usersBase),
      all: all(usersBase)
    },
    teams: {
      find: find(teamsBase),
      create: create(teamsBase),
      update: update(teamsBase),
      destroy: destroy(teamsBase),
      all: all(teamsBase)
    },
    companies: {
      find: find(companiesBase),
      create: create(companiesBase),
      update: update(companiesBase),
      destroy: destroy(companiesBase),
      all: all(companiesBase)
    },
    memberships: {
      find: find(membershipsBase),
      create: create(membershipsBase),
      update: update(memberships),
      destroy: destroy(membershipsBase),
      all: all(membershipsBase)
    },
    checkins: {
      find: find(checkinsBase),
      create: create(checkinsBase),
      update: update(checkinsBase),
      destroy: destroy(checkinsBase),
      all: all(checkinsBase)
    },
    sprints: {
      find: find(sprintsBase),
      create: create(sprintsBase),
      update: update(sprintsBase),
      destroy: destroy(sprintsBase),
      all: all(sprintsBase)
    }
  };
};

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
