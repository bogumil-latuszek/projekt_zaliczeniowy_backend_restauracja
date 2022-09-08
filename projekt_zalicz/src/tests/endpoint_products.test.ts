import { Product } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /products/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from products/ main URL", async () => {
        const response = await request(baseURL).get("/products/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing products/", async () => {
        //assume
        const prod1: Product = {
            Name: "ziemniaki",
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
        }
        const prod2: Product = {
            Name: "ananasy",
            Price: 15,
            Quantity: 10,
            Measurement_Units: "szt"
        }
        const response1 = await request(baseURL).post("/products/").send(prod1);
        const response2 = await request(baseURL).post("/products/").send(prod2);

        //act
        const response = await request(baseURL).get("/products/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "ziemniaki",
            Price: 5,
            Quantity: 1,
            Measurement_Units: "kg"
          }
        ))
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "ananasy",
            Price: 15,
            Quantity: 10,
            Measurement_Units: "szt"
          }
        ))
    });
});

describe("GET /products/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return product for existing ID", async () => {
        //assume
        const prod1: Product = {
            Name: "ziemniaki",
            Price: 5,
            Quantity: 17,
            Measurement_Units: "kg"
        }
        const response1 = await request(baseURL).post("/products/").send(prod1);
        const product_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/products/${product_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: product_id,
            Name: "ziemniaki",
            Price: 5,
            Quantity: 17,
            Measurement_Units: "kg"
          }
        ))
    });
});

describe("POST /products/", () => {
    //assume
    const newProduct: Product = {
        Name: "ziemniaki", 
        Price: 5,
        Quantity: 1,
        Measurement_Units: "kg"
    }

    afterAll(async () => {
        await clearAllData();
    });

    it("should add product and return its new ID", async () => {
        //act
        const response = await request(baseURL).post("/products/").send(newProduct);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });
});

describe("PUT /products/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update product for existing ID", async () => {
        //assume
        const prod1: Product = {
            Name: "ziemniaki",
            Price: 5,
            Quantity: 17,
            Measurement_Units: "kg"
        }
        const response1 = await request(baseURL).post("/products/").send(prod1);
        const product_id = response1.body.id

        //act
        const changed_prod: Product = {
            Name: "młode ziemniaki",
            Price: 12,
            Quantity: 19,
            Measurement_Units: "kg"
        }
        const response = await request(baseURL).put(`/products/${product_id}`).send(changed_prod);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/products/${product_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: product_id,
            Name: "młode ziemniaki",
            Price: 12,
            Quantity: 19,
            Measurement_Units: "kg"
          }
        ))
    });
});

describe("DELETE /products/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete product for existing ID", async () => {
        //assume
        const prod1: Product = {
            Name: "ziemniaki",
            Price: 5,
            Quantity: 17,
            Measurement_Units: "kg"
        }
        const response1 = await request(baseURL).post("/products/").send(prod1);
        const product_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/products/${product_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/products/${product_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
