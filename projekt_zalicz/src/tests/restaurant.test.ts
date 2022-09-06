import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Restaurant } from "model"
import { Mongo_Restaurant } from "mongo_models"
import { getRestaurantAccess } from "data_access_selector"



describe("HasRestaurant Testing", () => {
    let db_restaurant = getRestaurantAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Restaurant.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasRestaurant returns false when asked for non existant id', async () => {
        //act
        let result = await db_restaurant.HasRestaurant("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasRestaurant returns false when asked for id with wrong structure', async () => {
        //act
        let result = await db_restaurant.HasRestaurant("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasRestaurant returns true when asked for existing id', async () => {
        // assume
        const firma: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        };
        let new_restaurant_id  = await db_restaurant.AddRestaurant(firma);
        // act
        let result = await db_restaurant.HasRestaurant(new_restaurant_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetRestaurant Testing", () => {
    let db_restaurant = getRestaurantAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Restaurant.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetRestaurant returns existing restaurant when given its id', async () => {
        // assume
        const firma: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        };
        let new_restaurant_id  = await db_restaurant.AddRestaurant(firma);
        // act
        let result = await db_restaurant.GetRestaurant(new_restaurant_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.Name).toEqual(firma.Name);
        expect(result.Address).toEqual(firma.Address);
        expect(result.Phone).toEqual(firma.Phone);
        expect(result.nip).toEqual(firma.nip);
        expect(result.email).toEqual(firma.email);
        expect(result.website).toEqual(firma.website);
    });

    test('GetRestaurant throws error when given id of nonexisting restaurant', async () => {
        try {
            //act
            let result = await db_restaurant.GetRestaurant("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no restaurant found for given id");
        }
     
    });

    test('GetRestaurant throws error when given id in inappropriate format', async () => {
        try {
            //act
            let result = await db_restaurant.GetRestaurant("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no restaurant found for given id");
        }
     
    });
});

describe("AddRestaurant Testing", () => {
    let db_restaurant = getRestaurantAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Restaurant.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('AddRestaurant returns id of newly created restaurant', async () => {
        //assume
        const firma: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        };
        const dishDataAccess = getRestaurantAccess();
        //act
        const createdDish_id = await dishDataAccess.AddRestaurant(firma);
        //assert
        expect(createdDish_id).toBeDefined();
    });
    
    test('AddRestaurant returns valid id when given object that is an Restaurant', async () => {
        // assume
        const new_restaurant: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        };
        // act
        let new_restaurant_id  = await db_restaurant.AddRestaurant(new_restaurant);
        let new_restaurant_in_db = await db_restaurant.GetRestaurant(new_restaurant_id);
        // assert
        expect(new_restaurant_in_db).toBeDefined();
        expect(new_restaurant_in_db.Name).toEqual(new_restaurant.Name);
        expect(new_restaurant_in_db.Address).toEqual(new_restaurant.Address);
        expect(new_restaurant_in_db.Phone).toEqual(new_restaurant.Phone);
        expect(new_restaurant_in_db.nip).toEqual(new_restaurant.nip);
        expect(new_restaurant_in_db.email).toEqual(new_restaurant.email);
        expect(new_restaurant_in_db.website).toEqual(new_restaurant.website);
    });

    test('AddRestaurant returns valid id when given object that is an Restaurant but has more fields', async () => {
        // assume
        let new_restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
            additionalField1: "sdjflasjtwg4ds9",
            additionalField2: "sdjflasdsfafdasj"
        }
        // act
        let new_restaurant_id  = await db_restaurant.AddRestaurant(new_restaurant);
        let new_restaurant_in_db = await db_restaurant.GetRestaurant(new_restaurant_id);
        // assert
        expect(new_restaurant_in_db).toBeDefined();
        expect(new_restaurant_in_db.Name).toEqual(new_restaurant.Name);
        expect(new_restaurant_in_db.Address).toEqual(new_restaurant.Address);
        expect(new_restaurant_in_db.Phone).toEqual(new_restaurant.Phone);
        expect(new_restaurant_in_db.nip).toEqual(new_restaurant.nip);
        expect(new_restaurant_in_db.email).toEqual(new_restaurant.email);
        expect(new_restaurant_in_db.website).toEqual(new_restaurant.website);
    });

});

describe("UpdateRestaurant Testing", () => {
    let db_restaurant = getRestaurantAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Restaurant.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('UpdateRestaurant updates restaurant in db when given id of existing restaurant', async () => {
        // assume
        let new_restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        let new_restaurant_id  = await db_restaurant.AddRestaurant(new_restaurant);
        let newer_restaurant = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        // act
        await db_restaurant.UpdateRestaurant(newer_restaurant, new_restaurant_id);
        let updated_restaurant_in_db = await db_restaurant.GetRestaurant(new_restaurant_id);
        // assert
        expect(updated_restaurant_in_db).toBeDefined();
        expect(updated_restaurant_in_db.Name).toEqual(newer_restaurant.Name);
        expect(updated_restaurant_in_db.Address).toEqual(newer_restaurant.Address);
        expect(updated_restaurant_in_db.Phone).toEqual(newer_restaurant.Phone);
        expect(updated_restaurant_in_db.nip).toEqual(newer_restaurant.nip);
        expect(updated_restaurant_in_db.email).toEqual(newer_restaurant.email);
        expect(updated_restaurant_in_db.website).toEqual(newer_restaurant.website);
    });

    test('UpdateRestaurant throws error when given id of nonexisting restaurant', async () => {
        // assume
        let new_restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        let error = new Error("nothing for now")
        // act
        try {
            await db_restaurant.UpdateRestaurant(new_restaurant, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such restaurant exists");
    });

    test('UpdateRestaurant throws error when given id with incorrect type', async () => {
        // assume
        let new_restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        // act
        try {
            await db_restaurant.UpdateRestaurant(new_restaurant, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Restaurant\"");
        }
    });
});


describe("DeleteRestaurant Testing", () => {
    let db_restaurant = getRestaurantAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Restaurant.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('DeleteRestaurant deletes restaurant in db when given id of existing restaurant', async () => {
        // assume
        let new_restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        let new_restaurant_id  = await db_restaurant.AddRestaurant(new_restaurant);
        // act
        await db_restaurant.DeleteRestaurant(new_restaurant_id);
        let new_restaurant_exists_in_db = await db_restaurant.HasRestaurant(new_restaurant_id);
        // assert
        expect(new_restaurant_exists_in_db).toEqual(false)
    });

    test('DeleteRestaurant doesnt change db at all when given id of nonexisting restaurant', async () => {
        //assume
        let new_restaurant1 = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        let new_restaurant1_id  = await db_restaurant.AddRestaurant(new_restaurant1);
        let new_restaurant2 = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        let new_restaurant2_id  = await db_restaurant.AddRestaurant(new_restaurant2);
        // act
        await db_restaurant.DeleteRestaurant("56e6dd2eb4494ed008d595bd")
        // assert
        let restaurant1_exists = await db_restaurant.HasRestaurant(new_restaurant1_id);
        let restaurant2_exists = await db_restaurant.HasRestaurant(new_restaurant2_id);
        expect(restaurant1_exists).toEqual(true);
        expect(restaurant2_exists).toEqual(true);
    });

    test('DeleteRestaurant doesnt change db at all when given id with wrong structure', async () => {
        //assume
        let new_restaurant1 = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        let new_restaurant1_id  = await db_restaurant.AddRestaurant(new_restaurant1);
        let new_restaurant2 = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        let new_restaurant2_id  = await db_restaurant.AddRestaurant(new_restaurant2);
        // act
        await db_restaurant.DeleteRestaurant("56e6dd2eb4494ed008d595bd")
        // assert
        let restaurant1_exists = await db_restaurant.HasRestaurant(new_restaurant1_id);
        let restaurant2_exists = await db_restaurant.HasRestaurant(new_restaurant2_id);
        expect(restaurant1_exists).toEqual(true);
        expect(restaurant2_exists).toEqual(true);
    });

});
