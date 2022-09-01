import {
    setupDBConnection,
    teardownDBConnection,
} from "../mongo_db_data_access";
/*
import {
    Dish
} from "../model"
import {
    Mongo_Dish
} from "../mongo_models"
*/

describe("dishModel Testing", () => {
    beforeAll(() => {
        setupDBConnection();
    });
  
    afterAll(() => {
        teardownDBConnection();
    });
})

test('empty test', () => {
    expect(1).toEqual(1)
})