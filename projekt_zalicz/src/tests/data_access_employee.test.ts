import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Employee } from "model"
import { Mongo_Employee } from "mongo_models"
import { getEmployeeAccess } from "data_access_selector"



describe("HasEmployee Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasEmployee returns false when asked for non existant id', async () => {
        //act
        let result = await db_employee.HasEmployee("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasEmployee returns false when asked for id with wrong structure', async () => {
        //act
        let result = await db_employee.HasEmployee("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasEmployee returns true when asked for existing id', async () => {
        // assume
        const agent: Employee = {
            CorporateID: "1",
            Name: "John",
            Surename: "Bean3",
            Position: "MI6agent3",
        };
        let new_employee_id  = await db_employee.AddEmployee(agent);
        // act
        let result = await db_employee.HasEmployee(new_employee_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetEmployee Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetEmployee returns existing employee when given its id', async () => {
        // assume
        const agent: Employee = {
            CorporateID: "1",
            Name: "John",
            Surename: "Bean2",
            Position: "MI6agent2",
        };
        let new_employee_id  = await db_employee.AddEmployee(agent);
        // act
        let result = await db_employee.GetEmployee(new_employee_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.CorporateID).toEqual(agent.CorporateID);
        expect(result.Name).toEqual(agent.Name);
        expect(result.Surename).toEqual(agent.Surename);
        expect(result.Position).toEqual(agent.Position);
    });

    test('GetEmployee throws error when given id of nonexisting employee', async () => {
        try {
            //act
            let result = await db_employee.GetEmployee("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no employee found for given id");
        }
     
    });

    test('GetEmployee throws error when given id in inappropriate format', async () => {
        try {
            //act
            let result = await db_employee.GetEmployee("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no employee found for given id");
        }
     
    });
});

describe("GetAllEmployees Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetAllEmployees returns all existing employees', async () => {
        // assume
        let new_employee1 = {
            CorporateID: "1",
            Name: "Sylvester",
            Surename: "Stalone",
            Position: "rambo",
        }
        let new_employee1_id  = await db_employee.AddEmployee(new_employee1);
        let new_employee2 = {
            CorporateID: "2",
            Name: "Arnold",
            Surename: "Schwarzenegger",
            Position: "terminator",
        }
        let new_employee2_id  = await db_employee.AddEmployee(new_employee2);
        // act
        let result = await db_employee.GetAllEmployees();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
        expect(result).toContainEqual(expect.objectContaining(
            {
              _id: expect.anything(),  // DB assigned id
              CorporateID: "1",        // Corporate asigned id
              Name: "Sylvester",
              Surename: "Stalone",
              Position: "rambo",
            }
        ));
        expect(result).toContainEqual(expect.objectContaining(
            {
              _id: expect.anything(),  // DB assigned id
              CorporateID: "2",        // Corporate asigned id
              Name: "Arnold",
              Surename: "Schwarzenegger",
              Position: "terminator",
            }
        ));
    });

    test('GetAllEmployees returns empty array when there arent any employees', async () => {
        // act
        let result = await db_employee.GetAllEmployees();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});

describe("AddEmployee Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('AddEmployee returns id of newly created employee', async () => {
        //assume
        const agent: Employee = {
            CorporateID: "1",
            Name: "John",
            Surename: "Bean",
            Position: "MI6agent",
        };
        const dishDataAccess = getEmployeeAccess();
        //act
        const createdDish_id = await dishDataAccess.AddEmployee(agent);
        //assert
        expect(createdDish_id).toBeDefined();
        // looks like: {"id": "6318bff0fb26f4ec403e7959"}
        expect(createdDish_id).toEqual(expect.stringMatching(/^[0-9a-f]+/))
    });
    
    test('AddEmployee returns valid id when given object that is an Employee', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deep",
            Position: "actor",
        }
        // act
        let new_employee_id  = await db_employee.AddEmployee(new_employee);
        let new_employee_in_db = await db_employee.GetEmployee(new_employee_id);
        // assert
        expect(new_employee_in_db).toBeDefined();
        expect(new_employee_in_db.CorporateID).toEqual(new_employee.CorporateID);
        expect(new_employee_in_db.Name).toEqual(new_employee.Name);
        expect(new_employee_in_db.Surename).toEqual(new_employee.Surename);
        expect(new_employee_in_db.Position).toEqual(new_employee.Position);
    });

    test('AddEmployee returns valid id when given object that is an Employee but has more fields', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deeper",
            Position: "actor",
            additionalField1: "sdjflasjtwg4ds9",
            additionalField2: "sdjflasdsfafdasj"
        }
        // act
        let new_employee_id  = await db_employee.AddEmployee(new_employee);
        let new_employee_in_db = await db_employee.GetEmployee(new_employee_id);
        // assert
        expect(new_employee_in_db).toBeDefined();
        expect(new_employee_in_db.CorporateID).toEqual(new_employee.CorporateID);
        expect(new_employee_in_db.Name).toEqual(new_employee.Name);
        expect(new_employee_in_db.Surename).toEqual(new_employee.Surename);
        expect(new_employee_in_db.Position).toEqual(new_employee.Position);
    });

});

describe("UpdateEmployee Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('UpdateEmployee updates employee in db when given id of existing employee', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "Deeper",
            Position: "actor",
        }
        let new_employee_id  = await db_employee.AddEmployee(new_employee);
        let newer_employee = {
            CorporateID: "1",
            Name: "Johny",
            Surename: "TheDeepest",
            Position: "actor",
        }
        // act
        await db_employee.UpdateEmployee(newer_employee, new_employee_id);
        let updated_employee_in_db = await db_employee.GetEmployee(new_employee_id);
        // assert
        expect(updated_employee_in_db).toBeDefined();
        expect(updated_employee_in_db.CorporateID).toEqual(newer_employee.CorporateID);
        expect(updated_employee_in_db.Name).toEqual(newer_employee.Name);
        expect(updated_employee_in_db.Surename).toEqual(newer_employee.Surename);
        expect(updated_employee_in_db.Position).toEqual(newer_employee.Position);
    });

    test('UpdateEmployee can change corporate assigned ID of employee', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "Johnny",
            Surename: "English",
            Position: "agent",
        }
        let new_employee_id  = await db_employee.AddEmployee(new_employee);
        let newer_employee = {
            CorporateID: "007",
            Name: "Johnny",
            Surename: "English",
            Position: "agent",
        }
        // act
        await db_employee.UpdateEmployee(newer_employee, new_employee_id);
        let updated_employee_in_db = await db_employee.GetEmployee(new_employee_id);
        // assert
        expect(updated_employee_in_db).toBeDefined();
        expect(updated_employee_in_db.CorporateID).toEqual(newer_employee.CorporateID);
    });

    test('UpdateEmployee throws error when given id of nonexisting employee', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "John", 
            Surename: "Unknown",
            Position: "waiter"
        }
        let error = new Error("nothing for now")
        // act
        try {
            await db_employee.UpdateEmployee(new_employee, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such employee exists");
    });

    test('UpdateEmployee throws error when given id with incorrect type', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "John", 
            Surename: "NoBeen",
            Position: "waiter"
        }
        // act
        try {
            await db_employee.UpdateEmployee(new_employee, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Employee\"");
        }
    });
});


describe("DeleteEmployee Testing", () => {
    let db_employee = getEmployeeAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
 
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Employee.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('DeleteEmployee deletes employee in db when given id of existing employee', async () => {
        // assume
        let new_employee = {
            CorporateID: "1",
            Name: "Johnny",
            Surename: "English",
            Position: "waiter"
        }
        let new_employee_id  = await db_employee.AddEmployee(new_employee);
        // act
        await db_employee.DeleteEmployee(new_employee_id);
        let new_employee_exists_in_db = await db_employee.HasEmployee(new_employee_id);
        // assert
        expect(new_employee_exists_in_db).toEqual(false)
    });

    test('DeleteEmployee doesnt change db at all when given id of nonexisting Employee, and doesnt throw any errors', async () => {
        //assume
        let new_employee1 = {
            CorporateID: "1",
            Name: "Sylvester",
            Surename: "Stalone",
            Position: "rambo",
        }
        let new_employee1_id  = await db_employee.AddEmployee(new_employee1);
        let new_employee2 = {
            CorporateID: "2",
            Name: "Arnold",
            Surename: "Schwarzenegger",
            Position: "terminator",
        }
        let new_employee2_id  = await db_employee.AddEmployee(new_employee2);
        let result1 = await db_employee.GetAllEmployees();
        // act
        await db_employee.DeleteEmployee("56e6dd2eb4494ed008d595bd")
        let result2 = await db_employee.GetAllEmployees();
        // assert
        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });

    test('DeleteEmployee doesnt change db at all when given id in wrong notation, and doesnt throw any errors', async () => {
        //assume
        let new_employee1 = {
            CorporateID: "1",
            Name: "Sylvester",
            Surename: "Stalone",
            Position: "rambo",
        }
        let new_employee1_id  = await db_employee.AddEmployee(new_employee1);
        let new_employee2 = {
            CorporateID: "2",
            Name: "Arnold",
            Surename: "Schwarzenegger",
            Position: "terminator",
        }
        let new_employee2_id  = await db_employee.AddEmployee(new_employee2);
        let result1 = await db_employee.GetAllEmployees();
        // act
        await db_employee.DeleteEmployee("56e6dd2eb4494ed008d595bd")
        let result2 = await db_employee.GetAllEmployees();
        // assert
        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });
});
