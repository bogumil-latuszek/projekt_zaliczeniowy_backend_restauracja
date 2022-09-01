import {
    setupDBConnection,
    teardownDBConnection,
} from "../mongo_db_data_access";

import {
    Dish
} from "../model"
import {
    Mongo_Dish
} from "../mongo_models"


describe("dishModel Testing", () => {
    beforeAll(() => {
        setupDBConnection();
    });
  
    afterAll(() => {
        teardownDBConnection();
    });

    test('test Mongo_Dish creation', async () => {
        const cocaCola: Dish = {
            Name: "Coca Cola",
            Price: 7.30,
            Category: "drink",
          };
          const dish = new Mongo_Dish({ ...cocaCola });
          const createdDish = await dish.save();
          expect(createdDish).toBeDefined();
          expect(createdDish.Name).toBe(dish.Name);
          expect(createdDish.Price).toBe(dish.Price);
          expect(createdDish.Category).toBe(dish.Category);
    });
})