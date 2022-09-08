import { Dish } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /dishes/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from dishes/ main URL", async () => {
        const response = await request(baseURL).get("/dishes/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing dishes/", async () => {
        //assume
        const dish1: Dish = {
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
        }
        const dish2: Dish = {
            Name: "grzybowa",
            Price: 15,
            Category: "zupy"
        }
        const response1 = await request(baseURL).post("/dishes/").send(dish1);
        const response2 = await request(baseURL).post("/dishes/").send(dish2);

        //act
        const response = await request(baseURL).get("/dishes/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
          }
        ))
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "grzybowa",
            Price: 15,
            Category: "zupy"
          }
        ))
    });
});

describe("GET /dishes/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return dish for existing ID", async () => {
        //assume
        const dish1: Dish = {
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
        }
        const response1 = await request(baseURL).post("/dishes/").send(dish1);
        const dish_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/dishes/${dish_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: dish_id,
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
          }
        ))
    });
});

describe("POST /dishes/", () => {
    //assume
    const newDish: Dish = {
        Name: "ogórkowa",
        Price: 5,
        Category : "zupy"
    }

    afterAll(async () => {
        await clearAllData();
    });

    it("should add dish and return its new ID", async () => {
        //act
        const response = await request(baseURL).post("/dishes/").send(newDish);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });
});

describe("PUT /dishes/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update dish for existing ID", async () => {
        //assume
        const dish1: Dish = {
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
        }
        const response1 = await request(baseURL).post("/dishes/").send(dish1);
        const dish_id = response1.body.id

        //act
        const changed_dish: Dish = {
            Name: "grzybowa",
            Price: 15,
            Category: "zupy"
        }
        const response = await request(baseURL).put(`/dishes/${dish_id}`).send(changed_dish);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/dishes/${dish_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: dish_id,
            Name: "grzybowa",
            Price: 15,
            Category: "zupy"
          }
        ))
    });
});

describe("DELETE /dishes/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete dish for existing ID", async () => {
        //assume
        const dish1: Dish = {
            Name: "ogórkowa",
            Price: 5,
            Category : "zupy"
        }
        const response1 = await request(baseURL).post("/dishes/").send(dish1);
        const dish_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/dishes/${dish_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/dishes/${dish_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
