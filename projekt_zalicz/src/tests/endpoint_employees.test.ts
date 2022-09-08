import { Employee } from 'model';
import { initDataAccess, dropDataAccess, clearAllData } from 'data_access_selector'
import request from 'supertest';
const baseURL = "http://localhost:3000"

beforeAll(async () => {
    await initDataAccess();
});

afterAll(() => {
    dropDataAccess();
});

describe("GET /employees/", () => {

    afterEach(async () => {
        await clearAllData();
    });

    it("should return 200 from employees/ main URL", async () => {
        const response = await request(baseURL).get("/employees/");
        expect(response.statusCode).toBe(200);
    });

    it("should return all existing employees/", async () => {
        //assume
        const employee1: Employee = {
            CorporateID: "1",
            Name: "Sylvester",
            Surename: "Stalone",
            Position: "kucharz",
        }
        const employee2: Employee = {
            CorporateID: "2",
            Name: "Arnold",
            Surename: "Schwarzenegger",
            Position: "kelner",
        }
        const response1 = await request(baseURL).post("/employees/").send(employee1);
        const response2 = await request(baseURL).post("/employees/").send(employee2);

        //act
        const response = await request(baseURL).get("/employees/");

        //assert
        expect(response.body.length).toBe(2)
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            CorporateID: "1",
            Name: "Sylvester",
            Surename: "Stalone",
            Position: "kucharz",
          }
        ))
        expect(response.body).toContainEqual(expect.objectContaining(
          {
            _id: expect.anything(),
            CorporateID: "2",
            Name: "Arnold",
            Surename: "Schwarzenegger",
            Position: "kelner",
          }
        ))
    });
});

describe("GET /employees/:id", () => {

    afterEach(async () => {
        await clearAllData();
    });

    it("should return employee for existing Database ID", async () => {
        //assume
        const employee1: Employee = {
            CorporateID: "1",
            Name: "John",
            Surename: "Bean",
            Position: "kelner",
        }
        const response1 = await request(baseURL).post("/employees/").send(employee1);
        const employee_id = response1.body.id

        //act
        const response = await request(baseURL).get(`/employees/${employee_id}`);

        //assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(
          {
            _id: employee_id,
            CorporateID: "1",
            Name: "John",
            Surename: "Bean",
            Position: "kelner",
          }
        ))
    });
});

describe("POST /employees/", () => {

    afterEach(async () => {
        await clearAllData();
    });

    it("should add employee and return its new Database ID and CorporateID", async () => {
        //assume
        const newEmployee: Employee = {
            CorporateID: "007",
            Name: "Johnny",
            Surename: "English",
            Position: "kelner",
        }
        //act
        const response = await request(baseURL).post("/employees/").send(newEmployee);

        //assert
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual('application/json')
        // just to see it under debugger
        let json_resp = JSON.stringify(response.body)
        // looks like: {"id": "6318bff0fb26f4ec403e7959", "CorporateID": "1"}
        expect(response.body).toEqual(
            {
                id: expect.stringMatching(/^[0-9a-f]+$/),
                CorporateID: expect.stringMatching(/^\d+$/),
            }
        )
    });

    it("should protect against creating employee under already taken CorporateID", async () => {
        //assume
        const existingEmployee: Employee = {
            CorporateID: "007",
            Name: "James",
            Surename: "Bond",
            Position: "kelner",
        }
        await request(baseURL).post("/employees/").send(existingEmployee);
        //act
        const newEmployee: Employee = {
            CorporateID: "007",
            Name: "Johnny",
            Surename: "English",
            Position: "kelner",
        }
        const response = await request(baseURL).post("/employees/").send(newEmployee);

        //assert
        expect(response.statusCode).toBe(400);
        expect(response.type).toEqual('application/json')
        expect(response.body).toEqual(
            {
                error: "CorporateID=007 already taken by James Bond",
            }
        )
    });

});

describe("PUT /employees/:id", () => {

    afterEach(async () => {
        await clearAllData();
    });

    it("should update employee for existing ID", async () => {
        //assume
        const employee1: Employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deep",
            Position: "kelner",
        }
        const response1 = await request(baseURL).post("/employees/").send(employee1);
        const employee_id = response1.body.id

        //act
        const changed_employee: Employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deep",
            Position: "kucharz",
        }
        const response = await request(baseURL).put(`/employees/${employee_id}`).send(changed_employee);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/employees/${employee_id}`)
        expect(response2.body).toEqual(expect.objectContaining(
          {
            _id: employee_id,
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deep",
            Position: "kucharz",
          }
        ))
    });
});

describe("DELETE /employees/:id", () => {

    afterEach(async () => {
        await clearAllData();
    });

    it("should delete employee for existing ID", async () => {
        //assume
        const employee1: Employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deep",
            Position: "kucharz",
        }
        const response1 = await request(baseURL).post("/employees/").send(employee1);
        const employee_id = response1.body.id

        //act
        const response = await request(baseURL).delete(`/employees/${employee_id}`);

        //assert
        expect(response.statusCode).toBe(204);
        const response2 = await request(baseURL).get(`/employees/${employee_id}`)
        expect(response2.statusCode).toBe(404);
    });
});
