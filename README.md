# botkit-storage-airtable

An Airtable storage module for Botkit.

## Usage

Install
```
yarn add botkit-storage-airtable` # or npm install --save
botkit-storage-airtable

```

Next, require `botkit-storage-airtable` and pass it a config with a `apiKey`, `base`, and `tables` options.

Learn how to get an Airtable `apiKey`
[here](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-). 

To get you started, you can use this [Airtable
template](https://airtable.com/shrFPznwWrSKsCZXZ). Make a copy and modify it according to
your needs. Airtable isn't schemaless so you have to do some data modeling to
build anything custom.

Then pass the returned storage when creating your Botkit controller. Botkit will do the rest.

Make sure everything you store has an `id` property, that's what you'll use to look it up later.

```

var Botkit = require('botkit');

...

  const tables = ['bots', 'users', 'channels', 'teams'] # for slack, add your
  Airtable table names
  airtableStorage = require('botkit-storage-airtable')({
    apiKey: '...',
    base: '...',
    tables: tables
  }),
  controller = Botkit.slackbot({
      storage: airtableStorage
  });
```
*Note*: This may vary slightly depending on the bot platform you're building
for. Just ensure to find and update the storage property of the controller with
`airtableStorage`

```
// then you can use the Botkit storage api, make sure you have an id property
var beans = {id: 'cool', beans: ['pinto', 'garbanzo']};
controller.storage.teams.save(beans);
beans = controller.storage.teams.get('cool');

```

## Acknowledgement
- [botkit-storage-firebase](https://github.com/howdyai/botkit-storage-firebase)
- [other storage
    modules](https://github.com/howdyai/botkit/blob/master/docs/readme-middlewares.md#storage-modules)
