import { Order } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});//,1000000

afterAll(() => {
    dropDataAccess();
});

describe("GET /orders/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from orders/ main URL", async () => {
        const response = await request(baseURL).get("/orders/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing orders/", async () => { //there is additional order created by some other test
        //assume
        const order1 : Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        const order2 = {
            TableName: "table 2",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Bill: 30
        }
        const response1 = await request(baseURL).post("/orders/").send(order1);
        const response2 = await request(baseURL).post("/orders/").send(order2);

        //act
        const response = await request(baseURL).get("/orders/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response).toBeDefined();
        expect(response).toHaveProperty("id");//error
        
    });
});

describe("GET /orders/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return order for existing ID", async () => {
        //assume
        const order1: Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        const response1 = await request(baseURL).post("/orders/").send(order1);
        const order_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/orders/${order_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
            {
                _id: order_id,
                TableName: "table 1",
                EmployeeID: "1",
                DishesNames: new Array("ogórkowa","placki ziemniaczane"),
                Status: "złożone",
                Bill: 30
            }
        ))
    });
});

describe("POST /orders/", () => {

    afterAll(async () => {
        await clearAllData(); //doesnt get called when test exceeds timeout
    });

    it("should add order and return its new ID", async () => {
        //assume
        const newOrder: Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        //act
        const response = await request(baseURL).post("/orders/").send(newOrder);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });

    it("should calculate and add bill when its not explicitly given", async () => { //exceeded timeout of 5000ms
        //assume
        const dish1 = {
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
        }
        const dish2 = {
            Name: "placki ziemniaczane",
            Price: 12,
            Category : "dania główne"
        }
        const dish1_id = await request(baseURL).post("/dishes/").send(dish1);
        const dish2_id = await request(baseURL).post("/dishes/").send(dish2);
        const newOrder: Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown"
        }
        //act
        const newly_added_id = await request(baseURL).post("/orders/").send(newOrder);
        const response = await request(baseURL).get(`/orders/${newly_added_id}`);//for some reason cant find existing order
        //assert
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
        expect(response.body).toEqual({Bill: 17})
    });
});

describe("PUT /orders/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update order for existing ID", async () => {
        //assume
        const order1: Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        const response1 = await request(baseURL).post("/orders/").send(order1);
        const order_id = response1.body.id

        //act
        const changed_order: Order = {
            TableName: "table 2",
            EmployeeID: "2",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        const response = await request(baseURL).put(`/orders/${order_id}`).send(changed_order);

        //assert
        expect(response.statusCode).toBe(204); //error it was 400
        const response2 = await request(baseURL).get(`/orders/${order_id}`)
        
        expect(response2.body.TableName).toEqual("table 2");
        expect(response2.body.EmployeeID).toEqual("2");
        expect(response2.body.DishesNames).toEqual(new Array("ogórkowa","placki ziemniaczane"));
        expect(response2.body.Status).toEqual("table 2");
        //expect(response2.body.Creation_date).toEqual();
        expect(response2.body.Bill).toEqual(30);
    });
});

describe("DELETE /orders/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete order for existing ID", async () => {
        //assume
        const order1: Order = {
            TableName: "table 1",
            EmployeeID: "1",
            DishesNames: new Array("ogórkowa","placki ziemniaczane"),
            Status: "złożone",
            Creation_date: "unknown",
            Bill: 30
        }
        const response1 = await request(baseURL).post("/orders/").send(order1);
        const order_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/orders/${order_id}`);

        //assert
        expect(response.statusCode).toBe(204); //error it was 400
        const response2 = await request(baseURL).get(`/orders/${order_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
