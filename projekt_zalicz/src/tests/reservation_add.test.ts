const setupDBConnection = require('../db_data_access'); //we should probably instantiate whole object


test('db connection test', () =>{
    setupDBConnection()
    expect(console.assert).toEqual("MongoDB started")
} )
