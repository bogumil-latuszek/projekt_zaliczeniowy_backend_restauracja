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

    test('GetAllDishes returns empty array when there arent any dishes', async () =>{
        // act
        let result = await db_dish.GetAllDishes();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});

describe("AddDish Testing", () => {
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

    test('AddDish returns valid id when given object that is a Dish', async () =>{
        // assume
        let new_dish = {
            Name: "pomidorowa", 
            Price: 6,
            Category: "zupy"
        }
        // act
        let new_dish_id  = await db_dish.AddDish(new_dish);
        let new_dish_in_db = await db_dish.GetDish(new_dish_id);
        // assert
        expect(new_dish_in_db).toBeDefined();
        expect(new_dish_in_db.Name).toEqual(new_dish.Name);
        expect(new_dish_in_db.Price).toEqual(new_dish.Price);
        expect(new_dish_in_db.Category).toEqual(new_dish.Category);
    });

    test('AddDish returns valid id when given object that is a Dish but has more fields', async () =>{
        // assume
        let new_dish = {
            Name: "pomidorowa", 
            Price: 6,
            Category: "zupy",
            additionalField1: "sdjflasjtwg4ds9",
            additionalField2: "sdjflasdsfafdasj"
        }
        // act
        let new_dish_id  = await db_dish.AddDish(new_dish);
        let new_dish_in_db = await db_dish.GetDish(new_dish_id);
        // assert
        expect(new_dish_in_db).toBeDefined();
        expect(new_dish_in_db.Name).toEqual(new_dish.Name);
        expect(new_dish_in_db.Price).toEqual(new_dish.Price);
        expect(new_dish_in_db.Category).toEqual(new_dish.Category);
    });

});

describe("UpdateDish Testing", () => {
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

    test('UpdateDish updates dish in db when given id of existing dish', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        let new_dish_id  = await db_dish.AddDish(new_dish);
        let newer_dish = {
            Name: "murzynek", 
            Price: 16,
            Category: "desery",
            _id : new_dish_id
        }
        // act
        await db_dish.UpdateDish(newer_dish, new_dish_id);
        let second_dish_in_db = await db_dish.GetDish(new_dish_id);
        // assert
        expect(second_dish_in_db).toBeDefined();
        expect(second_dish_in_db.Name).toEqual("murzynek");
        expect(second_dish_in_db.Price).toEqual(16);
        expect(second_dish_in_db.Category).toEqual("desery");
    });

    test('UpdateDish throws error when given id of nonexisting dish', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_dish.UpdateDish(new_dish, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such dish exists");
    });

    test('UpdateDish throws error when given id with incorrect type', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        // act
        try{
            await db_dish.UpdateDish(new_dish, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Dish\"");
        }
    });


});

describe("DeleteDish Testing", () => {
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

    test('DeleteDish deletes dish in db when given id of existing dish', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        let new_dish_id  = await db_dish.AddDish(new_dish);
        // act
        await db_dish.DeleteDish(new_dish_id);
        let new_dish_exists_in_db = await db_dish.HasDish(new_dish_id);
        // assert
        expect(new_dish_exists_in_db).toEqual(false)
    });

    test('DeleteDish throws error when given id of nonexisting dish', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_dish.DeleteDish("56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such dish exists");
    });

    test('DeleteDish throws error when given id with incorrect type', async () =>{
        // assume
        let new_dish = {
            Name: "ptasie mleczko", 
            Price: 12,
            Category: "desery"
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_dish.DeleteDish("56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Dish\"");
    });


});