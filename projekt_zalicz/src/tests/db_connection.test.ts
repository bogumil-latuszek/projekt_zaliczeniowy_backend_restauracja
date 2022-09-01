const mongoose = require('mongoose');


test('connection test', async () =>{
    await mongoose.connect('mongodb://localhost:27017/myapp')
} )
