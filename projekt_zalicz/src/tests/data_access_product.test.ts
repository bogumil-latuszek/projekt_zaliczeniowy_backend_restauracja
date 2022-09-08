import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Product } from "model"
import { Mongo_Product, Mongo_Reservation } from "mongo_models"
import { getProductsAccess } from "data_access_selector"

let db_product = getProductsAccess();

beforeAll(async () => {
    await connectDBForTesting();
});

afterAll(async () => {
    await disconnectDBForTesting();
});

afterEach(async () => {
    try {
        await Mongo_Product.collection.drop();
    }
    catch (err) {
        // ignore exception thrown from dropping nonexistent collection
        if (err.message !== 'ns not found') {
            throw err;
        }
    }
});

describe("HasProduct Testing", () => {

    test('HasProduct returns false when asked for non existant id', async () =>{
        //act
        let result = await db_product.HasProduct("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasProduct returns false when asked for id with wrong structure', async () =>{
        //act
        let result = await db_product.HasProduct("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasProduct returns true when asked for existing id', async () =>{
        // assume
        let new_product: Product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product_id  = await db_product.AddProduct(new_product);
        // act
        let result = await db_product.HasProduct(new_product_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetProduct Testing", () => {

    test('GetProduct returns existing product when given its id', async () =>{
        // assume
        let new_product: Product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product_id  = await db_product.AddProduct(new_product);
        // act
        let result = await db_product.GetProduct(new_product_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.Name).toEqual(new_product.Name);
        expect(result.Price).toEqual(new_product.Price);
        expect(result.Quantity).toEqual(new_product.Quantity);
        expect(result.Measurement_Units).toEqual(new_product.Measurement_Units);
    });

    test('GetProduct throws error when given id of nonexisting product', async () =>{
        try{
            //act
            let result = await db_product.GetProduct("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no product found for given id");
        }
        
    });

    test('GetProduct throws error when given id in inappropriate format', async () =>{
        try{
            //act
            let result = await db_product.GetProduct("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no product found for given id");
        }
        
    });
});

describe("GetAllProductes Testing", () => {

    test('GetAllProductes returns all existing productes', async () =>{
        // assume
        let new_product1: Product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product1_id  = await db_product.AddProduct(new_product1);
        let new_product2: Product= {
            Name: "sól", 
            Price: 14,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product2_id  = await db_product.AddProduct(new_product2);
        // act
        let result = await db_product.GetAllProducts();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
    });

    test('GetAllProductes returns empty array when there arent any productes', async () =>{
        // act
        let result = await db_product.GetAllProducts();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});

describe("AddProduct Testing", () => {

    test('AddProduct returns id of newly created product', async () => {
        //assume
        let new_product: Product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        const productDataAccess = getProductsAccess();
        //act
        const createdProduct_id = await productDataAccess.AddProduct(new_product);
        //assert
        expect(createdProduct_id).toBeDefined();
    });

    test('AddProduct returns valid id when given object that is a Product', async () =>{
        // assume
        let new_product: Product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        // act
        let new_product_id  = await db_product.AddProduct(new_product);
        let new_product_in_db = await db_product.GetProduct(new_product_id);
        // assert
        expect(new_product_in_db).toBeDefined();
        expect(new_product_in_db.Name).toEqual(new_product.Name);
        expect(new_product_in_db.Price).toEqual(new_product.Price);
        expect(new_product_in_db.Quantity).toEqual(new_product.Quantity);
        expect(new_product_in_db.Measurement_Units).toEqual(new_product.Measurement_Units);
    });

    test('AddProduct returns valid id when given object that is a Product but has more fields', async () =>{
        // assume
        let new_product = {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg",
            additionalField1: "sdjflasjtwg4ds9",
            additionalField2: "sdjflasdsfafdasj"
        }
        // act
        let new_product_id  = await db_product.AddProduct(new_product);
        let new_product_in_db = await db_product.GetProduct(new_product_id);
        // assert
        expect(new_product_in_db).toBeDefined();
        expect(new_product_in_db.Name).toEqual(new_product.Name);
        expect(new_product_in_db.Price).toEqual(new_product.Price);
        expect(new_product_in_db.Quantity).toEqual(new_product.Quantity);
        expect(new_product_in_db.Measurement_Units).toEqual(new_product.Measurement_Units);
    });

});

describe("UpdateProduct Testing", () => {

    test('UpdateProduct updates product in db when given id of existing product', async () =>{
        // assume
        let new_product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product_id  = await db_product.AddProduct(new_product);
        let newer_product = {
            Name: "cebula", 
            Price: 7,
            Quantity: 1,
            Measurement_Units: "kg",
        }
        // act
        await db_product.UpdateProduct(newer_product, new_product_id);
        let second_product_in_db = await db_product.GetProduct(new_product_id);
        // assert
        expect(second_product_in_db).toBeDefined();
        expect(second_product_in_db.Name).toEqual("cebula");
        expect(second_product_in_db.Price).toEqual(7);
        expect(second_product_in_db.Quantity).toEqual(1);
        expect(second_product_in_db.Measurement_Units).toEqual("kg");
    });

    test('UpdateProduct throws error when given id of nonexisting product', async () =>{
        // assume
        let new_product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_product.UpdateProduct(new_product, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such product exists");
    });

    test('UpdateProduct throws error when given id with incorrect type', async () =>{
        // assume
        let new_product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        // act
        try{
            await db_product.UpdateProduct(new_product, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Product\"");
        }
    });


});

describe("DeleteProduct Testing", () => {

    test('DeleteProduct deletes product in db when given id of existing product', async () =>{
        // assume
        let new_product= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product_id  = await db_product.AddProduct(new_product);
        // act
        await db_product.DeleteProduct(new_product_id);
        let new_product_exists_in_db = await db_product.HasProduct(new_product_id);
        // assert
        expect(new_product_exists_in_db).toEqual(false)
    });

    test('DeleteProduct doesnt change db at all when given id of nonexisting product, and doesnt throw any errors', async () =>{
        //assume
        let new_product1= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product1_id  = await db_product.AddProduct(new_product1);
        let new_product2= {
            Name: "pieprz", 
            Price: 13,
            Quantity: 2,
            Measurement_Units: "kg"
        }
        let new_product2_id  = await db_product.AddProduct(new_product2);
        let result1 = await db_product.GetAllProducts();
        // act
        await db_product.DeleteProduct("56e6dd2eb4494ed008d595bd")
        let result2 = await db_product.GetAllProducts();
        // assert
        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });

    test('DeleteProduct doesnt change db at all when given id in wrong notation, and doesnt throw any errors', async () =>{
        //assume
        let new_product1= {
            Name: "ziemniaki", 
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        let new_product1_id  = await db_product.AddProduct(new_product1);
        let new_product2= {
            Name: "pieprz", 
            Price: 13,
            Quantity: 2,
            Measurement_Units: "kg"
        }
        let new_product2_id  = await db_product.AddProduct(new_product2);
        let result1 = await db_product.GetAllProducts();
        // act
        await db_product.DeleteProduct("wrong id")
        let result2 = await db_product.GetAllProducts();
        // assert
        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });
});