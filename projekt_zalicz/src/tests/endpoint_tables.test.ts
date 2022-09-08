import { Table } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /tables/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from tables/ main URL", async () => {
        const response = await request(baseURL).get("/tables/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing tables/", async () => {
        //assume
        const table1: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty"
        }
        const table2: Table = {
            Name: "stolik2", 
            Capacity: 3,
            Status: "wolny"
        }
        const response1 = await request(baseURL).post("/tables/").send(table1);
        const response2 = await request(baseURL).post("/tables/").send(table2);

        //act
        const response = await request(baseURL).get("/tables/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty"
          }
        ))
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            Name: "stolik2", 
            Capacity: 3,
            Status: "wolny"
          }
        ))
    });
});

describe("GET /tables/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return table for existing ID", async () => {
        //assume
        const table1: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty"
        }
        const response1 = await request(baseURL).post("/tables/").send(table1);
        const table_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/tables/${table_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: table_id,
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty"
          }
        ))
    });
});

describe("POST /tables/", () => {
    //assume
    const newTable: Table = {
        Name: "stolik1", 
        Capacity: 5,
        Status: "zajęty"
    }

    afterAll(async () => {
        await clearAllData();
    });

    it("should add table and return its new ID", async () => {
        //act
        const response = await request(baseURL).post("/tables/").send(newTable);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });
});

describe("PUT /tables/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update table for existing ID", async () => {
        //assume
        const table1: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty"
        }
        const response1 = await request(baseURL).post("/tables/").send(table1);
        const table_id = response1.body.id

        //act
        const changed_table: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "wolny"
        }
        const response = await request(baseURL).put(`/tables/${table_id}`).send(changed_table);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/tables/${table_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: table_id,
            Name: "stolik1", 
            Capacity: 5,
            Status: "wolny"
          }
        ))
    });
});

describe("DELETE /tables/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete table for existing ID", async () => {
        //assume
        const table1: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "wolny"
        }
        const response1 = await request(baseURL).post("/tables/").send(table1);
        const table_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/tables/${table_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/tables/${table_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
