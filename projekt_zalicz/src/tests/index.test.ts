
const clone_array = require('../index');


test('cloneArray returns different object but with the same fields', () =>{
    let testArray = [1,2,3]
    expect(clone_array(testArray)).toEqual(testArray)
    expect(clone_array(testArray)).not.toBe(testArray)
} )