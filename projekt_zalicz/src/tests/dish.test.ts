import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "../mongo_db_data_access";

import { Dish } from "model"
import { Mongo_Dish, Mongo_Reservation } from "mongo_models"
import { MongoDbDishes } from "mongo_db_data_access"
import { getDishesAccess } from "data_access_selector"


describe("dishModel Testing", () => {
    beforeAll(async () => {
        await connectDBForTesting();
    });
  
    afterAll(async () => {
        await disconnectDBForTesting();
    });
  
    afterEach(async () => {
        await Mongo_Dish.collection.drop();
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
          const dishDataAccess = new MongoDbDishes()
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

describe("HasDish Testing", () => {
    let db_dish = getDishesAccess();
    beforeAll(async () => {
        await connectDBForTesting();
    });
  
    afterAll(async () => {
        await disconnectDBForTesting();
    });
  
    afterEach(async () => {
        await Mongo_Reservation.collection.drop();
    });

    test('HasDish returns false when asked for non existant id', async () =>{

        let result = await db_dish.HasDish("56e6dd2eb4494ed008d595bd");
        expect(result).toEqual(false);
    });

    /*test('HasDish returns error when asked for id with wrong structure', async () =>{

        let result = await db_dish.HasDish("wrong");
        expect(result).toEqual(false);
    });*/
});