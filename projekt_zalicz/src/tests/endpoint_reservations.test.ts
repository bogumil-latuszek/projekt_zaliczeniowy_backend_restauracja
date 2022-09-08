import { Reservation } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /reservations/", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return 200 from reservations/ main URL", async () => {
        const response = await request(baseURL).get("/reservations/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing reservations/", async () => {
        //assume
        const reservation1: Reservation = {
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        const reservation2: Reservation = {
            TableName : "stolik_02",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "tomasz"
        }
        const response1 = await request(baseURL).post("/reservations/").send(reservation1);
        const response2 = await request(baseURL).post("/reservations/").send(reservation2);

        //act
        const response = await request(baseURL).get("/reservations/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
          }
        ))
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            TableName : "stolik_02",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "tomasz"
          }
        ))
    });
});

describe("GET /reservations/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should return reservation for existing ID", async () => {
        //assume
        const reservation1: Reservation = {
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        const response1 = await request(baseURL).post("/reservations/").send(reservation1);
        const reservation_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/reservations/${reservation_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: reservation_id,
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
          }
        ))
    });
});

describe("POST /reservations/", () => {
    //assume
    const new_reservation: Reservation = {
        TableName : "stolik_01",
        Time_Start : "2018-12-10T13:45:00.000",
        Time_End : "2018-12-10T15:00:00.000",
        Client_Name : "jan"
    }

    afterAll(async () => {
        await clearAllData();
    });

    it("should add reservation and return its new ID", async () => {
        //act
        const response = await request(baseURL).post("/reservations/").send(new_reservation);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(response.body).toEqual({id: expect.stringMatching(/^[0-9a-f]+/)})
    });
});

describe("PUT /reservations/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should update reservation for existing ID", async () => {
        //assume
        const reservation1: Reservation = {
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        const response1 = await request(baseURL).post("/reservations/").send(reservation1);
        const reservation_id = response1.body.id

        //act
        const changed_reservation: Reservation = {
            TableName : "stolik_02",
            Time_Start : "2018-12-10T14:45:00.000",
            Time_End : "2018-12-10T16:00:00.000",
            Client_Name : "jan"
        }
        const response = await request(baseURL).put(`/reservations/${reservation_id}`).send(changed_reservation);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/reservations/${reservation_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: reservation_id,
            TableName : "stolik_02",
            Time_Start : "2018-12-10T14:45:00.000",
            Time_End : "2018-12-10T16:00:00.000",
            Client_Name : "jan"
          }
        ))
    });
});

describe("DELETE /reservations/:id", () => {

    afterAll(async () => {
        await clearAllData();
    });

    it("should delete reservation for existing ID", async () => {
        //assume
        const reservation1: Reservation = {
            TableName : "stolik_01",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        const response1 = await request(baseURL).post("/reservations/").send(reservation1);
        const reservation_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/reservations/${reservation_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/reservations/${reservation_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
