import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Dish } from "model"
import { Mongo_Dish, Mongo_Reservation } from "mongo_models"
import { MongoDbDishes } from "mongo_db_data_access"
import { getDishesAccess } from "data_access_selector"



describe("Mongo model dish creation", () => {
    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });
    
    afterEach(async () => {
        await Mongo_Dish.collection.drop();
    });

    test('create dish returns dish with new id', async () => {
        
        //assume
        const cocaCola: Dish = {
            Name: "Coca Cola",
            Price: 7.30,
            Category: "drink",
        };
        //act
        const dish = new Mongo_Dish({ ...cocaCola });
        const createdDish = await dish.save();
        //assert
        expect(createdDish).toBeDefined();
        expect(createdDish).toHaveProperty("_id");
        expect(createdDish.Name).toBe(cocaCola.Name);
        expect(createdDish.Price).toBe(cocaCola.Price);
        expect(createdDish.Category).toBe(cocaCola.Category);
    });
})

describe("AddDish Testing", () => {
    beforeAll(async () => {
        await connectDBForTesting();
    });
  
    afterAll(async () => {
        await disconnectDBForTesting();
    });
  
    afterEach(async () => {
        await Mongo_Dish.collection.drop();
    });

    test('AddDish returns id of newly created dish (using Mongo data access layer)', async () => {
        //assume
        const sprite: Dish = {
            Name: "Sprite",
            Price: 7.10,
            Category: "drink",
        };
        const dishDataAccess = new MongoDbDishes();
        //act
        const createdDish_id = await dishDataAccess.AddDish(sprite);
        //assert
        expect(createdDish_id).toBeDefined();
    });

    test('AddDish returns id of newly created dish (using config selected data access layer)', async () => {
        //assume
        const sprite: Dish = {
            Name: "Sprite",
            Price: 7.10,
            Category: "drink",
        };
        const dishDataAccess = getDishesAccess();
        //act
        const createdDish_id = await dishDataAccess.AddDish(sprite);
        //assert
        expect(createdDish_id).toBeDefined();
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
        try {
            await Mongo_Dish.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasDish returns false when asked for non existant id', async () =>{
        //act
        let result = await db_dish.HasDish("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasDish returns false when asked for id with wrong structure', async () =>{
        //act
        let result = await db_dish.HasDish("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasDish returns true when asked for existing id', async () =>{
        // assume
        let new_dish = {
            Name: "pierogi", 
            Price: 17,
            Category: "dania główne"
        }
        let new_dish_id  = await db_dish.AddDish(new_dish);
        // act
        let result = await db_dish.HasDish(new_dish_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetDish Testing", () => {
    let db_dish = getDishesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Dish.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetDish returns existing dish when given its id', async () =>{
        // assume
        let new_dish = {
            Name: "pierogi", 
            Price: 17,
            Category: "dania główne"
        }
        let new_dish_id  = await db_dish.AddDish(new_dish);
        // act
        let result = await db_dish.GetDish(new_dish_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.Category).toEqual(new_dish.Category);
        expect(result.Name).toEqual(new_dish.Name);
        expect(result.Price).toEqual(new_dish.Price);
    });

    test('GetDish throws error when given id of nonexisting dish', async () =>{
        try{
            //act
            let result = await db_dish.GetDish("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no dish found for given id");
        }
        
    });

    test('GetDish throws error when given id in inappropriate format', async () =>{
        try{
            //act
            let result = await db_dish.GetDish("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("id in inappropriate format");
        }
        
    });
});

describe("GetAllDishes Testing", () => {
    let db_dish = getDishesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Dish.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetAllDishes returns all existing dishes', async () =>{
        // assume
        let new_dish1 = {
            Name: "pierogi", 
            Price: 17,
            Category: "dania główne"
        }
        let new_dish1_id  = await db_dish.AddDish(new_dish1);
        let new_dish2 = {
            Name: "ogórkowa", 
            Price: 8,
            Category: "zupy"
        }
        let new_dish2_id  = await db_dish.AddDish(new_dish2);
        // act
        let result = await db_dish.GetAllDishes();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
    });
});
/*
    GetAllDishes(): Promise<Dish[]>;
    AddDish(dish:Dish): Promise<string>;
    UpdateDish(Dish:Dish): Promise<void>;
    DeleteDish(id:string): Promise<void>;
*/