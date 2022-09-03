import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "../mongo_db_data_access";

import { Dish } from "model"
import { Mongo_Dish } from "mongo_models"
import { DbDishes } from "mongo_db_data_access"
import { getDishesAccess } from "data_access_selector"


describe("dishModel Testing", () => {
    beforeAll(async () => {
        await connectDBForTesting();
    });
  
    afterAll(async () => {
        await Mongo_Dish.collection.drop();
        await disconnectDBForTesting();
    });

    test('test Mongo_Dish direct creation', async () => {
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

    test('test Mongo_Dish creation via specific data access layer', async () => {
        const sprite: Dish = {
            Name: "Sprite",
            Price: 7.10,
            Category: "drink",
          };
          const dishDataAccess = new DbDishes()
          const createdDish = await dishDataAccess.AddDish(sprite);
          expect(createdDish).toBeDefined();
          expect(createdDish.Name).toBe(sprite.Name);
          expect(createdDish.Price).toBe(sprite.Price);
          expect(createdDish.Category).toBe(sprite.Category);
    });

    test('test Mongo_Dish creation via config selected data access layer', async () => {
        const sprite: Dish = {
            Name: "Sprite",
            Price: 7.10,
            Category: "drink",
          };
          const dishDataAccess = getDishesAccess()
          const createdDish = await dishDataAccess.AddDish(sprite);
          expect(createdDish).toBeDefined();
          expect(createdDish.Name).toBe(sprite.Name);
          expect(createdDish.Price).toBe(sprite.Price);
          expect(createdDish.Category).toBe(sprite.Category);
    });
})
