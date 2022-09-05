import { connectDBForTesting, disconnectDBForTesting,} from "mongo_db_data_access";

import { Order } from "model"
import { Mongo_Order} from "mongo_models"
import { getOrdersAccess } from "data_access_selector"

describe("HasOrder Testing", () => {
    let db_order = getOrdersAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Order.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasOrder returns false when asked for non existant id', async () => {
        //act
        let result = await db_order.HasOrder("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasOrder returns false when asked for id with wrong structure', async () => {
        //act
        let result = await db_order.HasOrder("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasOrder returns true when asked for existing id', async () =>{
        // assume
        const new_order: Order = {
            TableName: "stolik_03",
            EmployeeID: "KEL-03",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
        };
        let new_order_id  = await db_order.AddOrder(new_order);
        // act
        let result = await db_order.HasOrder(new_order_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetOrder Testing", () => {
    let db_order = getOrdersAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Order.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetOrder returns existing dish when given its id', async () => {
        // assume
        const new_order: Order = {
            TableName: "stolik_03",
            EmployeeID: "KEL-03",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        };
        let new_order_id  = await db_order.AddOrder(new_order);
        // act
        let result = await db_order.GetOrder(new_order_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.TableName).toEqual(new_order.TableName);
        expect(result.EmployeeID).toEqual(new_order.EmployeeID);
        expect(result.DishesNames).toEqual(new_order.DishesNames);
        expect(result.Status).toEqual(new_order.Status);
        expect(result.Creation_date).toEqual(new_order.Creation_date);
        expect(result.Bill).toEqual(new_order.Bill);
    });

    test('GetOrder returns undefined when given id of nonexisting dish', async () => {
        //act
        let result = await db_order.GetOrder("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(undefined);
    });

    test('GetOrder returns undefined when given id in inappropriate format', async () =>{
        //act
        let result = await db_order.GetOrder("wrong format");
        //assert
        expect(result).toEqual(undefined); 
    });
});

describe("Get Orders Testing", () => {
    let db_order = getOrdersAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Order.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetAllOrders returns all existing orders', async () =>{
        // assume
        let new_order1 = {
            TableName: "stolik_03",
            EmployeeID: "KEL-03",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        }
        let new_order1_id  = await db_order.AddOrder(new_order1);
        let new_order2 = {
            TableName: "stolik_04",
            EmployeeID: "KEL-04",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        }
        let new_order2_id  = await db_order.AddOrder(new_order2);
        // act
        let result = await db_order.GetAllOrders();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
    });

    test('GetOrdersForTable returns all orders for table', async () => {
        // assume
        let new_order1 = {
            TableName: "stolik_03",
            EmployeeID: "KEL-03",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        }
        let new_order1_id  = await db_order.AddOrder(new_order1);
        let order1  = await db_order.GetOrder(new_order1_id);
        let new_order2 = {
            TableName: "stolik_04",
            EmployeeID: "KEL-04",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        }
        let new_order2_id  = await db_order.AddOrder(new_order2);
        let order2  = await db_order.GetOrder(new_order2_id);
        let new_order3 = {
            TableName: "stolik_04",
            EmployeeID: "KEL-04",
            DishesNames: ["rosół", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 120
        }
        let new_order3_id  = await db_order.AddOrder(new_order3);
        let order3  = await db_order.GetOrder(new_order3_id);
        // act
        let result = await db_order.GetOrdersForTable("stolik_04");
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
        expect(result).not.toContainEqual(order1);
        expect(result).toContainEqual(order2);
        expect(result).toContainEqual(order3);
    });

    test('GetOrdersTakenByEmployee returns all orders taken by given waiter', async () => {
        // assume
        let new_order1 = {
            TableName: "stolik_03",
            EmployeeID: "KEL-04",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
            Bill: 124
        }
        let new_order1_id  = await db_order.AddOrder(new_order1);
        let order1  = await db_order.GetOrder(new_order1_id);
        let new_order2 = {
            TableName: "stolik_04",
            EmployeeID: "KEL-04",
            DishesNames: ["pomidorowa", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 11:30",
            Bill: 124
        }
        let new_order2_id  = await db_order.AddOrder(new_order2);
        let order2  = await db_order.GetOrder(new_order2_id);
        let new_order3 = {
            TableName: "stolik_04",
            EmployeeID: "KEL-03",
            DishesNames: ["rosół", "devolay-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 09:30",
            Bill: 120
        }
        let new_order3_id  = await db_order.AddOrder(new_order3);
        let order3  = await db_order.GetOrder(new_order3_id);
        // act
        let result = await db_order.GetOrdersTakenByEmployee("KEL-04");
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
        expect(result).toContainEqual(order1);
        expect(result).toContainEqual(order2);
        expect(result).not.toContainEqual(order3);
    });

    test('GetAllOrders returns empty array when there arent any dishes', async () => {
        // act
        let result = await db_order.GetAllOrders();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});


describe("AddOrder Testing", () => {
    let db_order = getOrdersAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Order.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('AddOrder returns id of newly created order', async () => {
        //assume
        const order_77: Order = {
            TableName: "stolik_01",
            EmployeeID: "KEL-07",
            DishesNames: ["pomidorowa", "schabowy-zestaw"],
            Status: "złożony",
            Creation_date: "2022-09-05 10:30",
        };
        const orderDataAccess = getOrdersAccess();
        //act
        const createdOrder_id = await orderDataAccess.AddOrder(order_77);
        //assert
        expect(createdOrder_id).toBeDefined();
    });

});