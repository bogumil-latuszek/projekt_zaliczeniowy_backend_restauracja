import { Restaurant } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /restaurants/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from restaurants/ main URL", async () => {
        const response = await request(baseURL).get("/restaurants/");
        expect(response.statusCode).toBe(200);
    });

    it("should always return only one restaurant (if any created)", async () => {
        //assume
        const restaurant1: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        const restaurant2: Restaurant = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        const response1 = await request(baseURL).post("/restaurants/").send(restaurant1);
        const response2 = await request(baseURL).post("/restaurants/").send(restaurant2);

        //act
        const response = await request(baseURL).get("/restaurants/");

        //assert
        expect(response.body.length).toBe(1)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
          }
        ))
    });
});

describe("GET /restaurants/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return restaurant for existing ID", async () => {
        //assume
        const restaurant1: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        const response1 = await request(baseURL).post("/restaurants/").send(restaurant1);
        const restaurant_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/restaurants/${restaurant_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: restaurant_id,
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
          }
        ))
    });
});

describe("POST /restaurants/", () => {
    //assume
    const newRestaurant: Restaurant = {
        Name: "Dyniarnia",
        Address: "Lanckorona Rynek 100",
        Phone: "699-123-456",
        nip: "678-333-22-11",
        email: "biuro@dyniarnia.pl",
        website: "www.dyniarnia.pl",
    }

    afterAll(async () => {
        await clearAllData();
    });

    it("should add restaurant and return its new ID", async () => {
        //act
        const response = await request(baseURL).post("/restaurants/").send(newRestaurant);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });

    it("should not allow for creating more then one restaurant", async () => {
        //assume
        await request(baseURL).post("/restaurants/").send(newRestaurant);

        //act
        const restaurant2: Restaurant = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        const response = await request(baseURL).post("/restaurants/").send(restaurant2);

        //assert
        expect(response.statusCode).toBe(409);
    });

});

describe("PUT /restaurants/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update restaurant for existing ID", async () => {
        //assume
        const restaurant1: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        const response1 = await request(baseURL).post("/restaurants/").send(restaurant1);
        const restaurant_id = response1.body.id

        //act
        const changed_restaurant: Restaurant = {
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
        }
        const response = await request(baseURL).put(`/restaurants/${restaurant_id}`).send(changed_restaurant);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/restaurants/${restaurant_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: restaurant_id,
            Name: "Dyniarnia2",
            Address: "Lanckorona Rynek 110",
            Phone: "699-123-457",
            nip: "678-333-22-12",
            email: "biuro@dyniarnia2.pl",
            website: "www.dyniarnia2.pl",
          }
        ))
    });
});

describe("DELETE /restaurants/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete restaurant for existing ID", async () => {
        //assume
        const restaurant1: Restaurant = {
            Name: "Dyniarnia",
            Address: "Lanckorona Rynek 100",
            Phone: "699-123-456",
            nip: "678-333-22-11",
            email: "biuro@dyniarnia.pl",
            website: "www.dyniarnia.pl",
        }
        const response1 = await request(baseURL).post("/restaurants/").send(restaurant1);
        const restaurant_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/restaurants/${restaurant_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/restaurants/${restaurant_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
