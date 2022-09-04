import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Table } from "model"
import { Mongo_Table, Mongo_Reservation } from "mongo_models"
import { getTablesAccess } from "data_access_selector"

describe("HasTable Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasTable returns false when asked for non existant id', async () =>{
        //act
        let result = await db_table.HasTable("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasTable returns false when asked for id with wrong structure', async () =>{
        //act
        let result = await db_table.HasTable("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasTable returns true when asked for existing id', async () =>{
        // assume
        let new_table : Table = 
        {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        let new_table_id  = await db_table.AddTable(new_table);
        // act
        let result = await db_table.HasTable(new_table_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetTable Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetTable returns existing table when given its id', async () =>{
        // assume
        let new_table : Table = 
        {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        let new_table_id  = await db_table.AddTable(new_table);
        // act
        let result = await db_table.GetTable(new_table_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.Name).toEqual(new_table.Name);
        expect(result.Capacity).toEqual(new_table.Capacity);
        expect(result.Status).toEqual(new_table.Status);
        //expect(result.Order).toEqual(new_table.Order); //they are different becouse nested objects get assigned id-s too
    });

    test('GetTable throws error when given id of nonexisting table', async () =>{
        try{
            //act
            let result = await db_table.GetTable("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no table found for given id");
        }
        
    });

    test('GetTable throws error when given id in inappropriate format', async () =>{
        try{
            //act
            let result = await db_table.GetTable("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no table found for given id");
        }
        
    });
});

describe("GetAllTablees Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetAllTablees returns all existing tablees', async () =>{
        // assume
        let new_table1 = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        let new_table1_id  = await db_table.AddTable(new_table1);
        let new_table2 = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        let new_table2_id  = await db_table.AddTable(new_table2);
        // act
        let result = await db_table.GetAllTables();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
    });

    test('GetAllTablees returns empty array when there arent any tablees', async () =>{
        // act
        let result = await db_table.GetAllTables();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});

describe("AddTable Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('AddTable returns id of newly created table', async () => {
        //assume
        let newtable: Table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        const tableDataAccess = getTablesAccess();
        //act
        const createdTable_id = await tableDataAccess.AddTable(newtable);
        //assert
        expect(createdTable_id).toBeDefined();
    });

    test('AddTable returns valid id when given object that is a Table', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
    
        }
        // act
        let new_table_id  = await db_table.AddTable(new_table);
        let new_table_in_db = await db_table.GetTable(new_table_id);
        // assert
        expect(new_table_in_db).toBeDefined();
        expect(new_table_in_db.Name).toEqual(new_table.Name);
        expect(new_table_in_db.Capacity).toEqual(new_table.Capacity);
        expect(new_table_in_db.Status).toEqual(new_table.Status);
        //expect(new_table_in_db.Order).toEqual(new_table.Order);//they are different becouse nested objects get assigned id-s too
    });

    test('AddTable returns valid id when given object that is a Table but has more fields', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            },
            AnotherField: "hsgklflshdskjlkj"
    
        }
        // act
        let new_table_id  = await db_table.AddTable(new_table);
        let new_table_in_db = await db_table.GetTable(new_table_id);
        // assert
        expect(new_table_in_db).toBeDefined();
        expect(new_table_in_db.Name).toEqual(new_table.Name);
        expect(new_table_in_db.Capacity).toEqual(new_table.Capacity);
        expect(new_table_in_db.Status).toEqual(new_table.Status);
        //expect(new_table_in_db.Order).toEqual(new_table.Order);//they are different becouse nested objects get assigned id-s too
    });

});

describe("UpdateTable Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('UpdateTable updates table in db when given id of existing table', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
        }
        let new_table_id  = await db_table.AddTable(new_table);
        let newer_table = {
            Name: "stolik2", 
            Capacity: 2,
            Status: "wolny",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "nowak",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "piwo",
                    Price: 5,
                    Category: "alkohole"
                }],
                Status: "wydany",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 5
            }
        }
        // act
        await db_table.UpdateTable(newer_table, new_table_id);
        let second_table_in_db = await db_table.GetTable(new_table_id);
        // assert
        expect(second_table_in_db).toBeDefined();
        expect(second_table_in_db.Name).toEqual("stolik2");
        expect(second_table_in_db.Capacity).toEqual(2);
        expect(second_table_in_db.Status).toEqual("wolny");
        //expect(new_table_in_db.Order).toEqual(new_table.Order);//they are different becouse nested objects get assigned id-s too
    });

    test('UpdateTable throws error when given id of nonexisting table', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            },
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_table.UpdateTable(new_table, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such table exists");
    });

    test('UpdateTable throws error when given id with incorrect type', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            },
        }
        // act
        try{
            await db_table.UpdateTable(new_table, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Table\"");
        }
    });


});

describe("DeleteTable Testing", () => {
    let db_table = getTablesAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Table.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('DeleteTable deletes table in db when given id of existing table', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            },
        }
        let new_table_id  = await db_table.AddTable(new_table);
        // act
        await db_table.DeleteTable(new_table_id);
        let new_table_exists_in_db = await db_table.HasTable(new_table_id);
        // assert
        expect(new_table_exists_in_db).toEqual(false)
    });

    test('DeleteTable doesnt change db at all when given id of nonexisting table', async () =>{
        //assume
        let new_table1 = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
        }
        let new_table1_id  = await db_table.AddTable(new_table1);
        let new_table2 = {
            Name: "stolik2", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
        }
        let new_table2_id  = await db_table.AddTable(new_table2);
        let result1 = await db_table.GetAllTables();
        let error = new Error("nothing for now")
        // act

        try{
            await db_table.DeleteTable("56e6dd2eb4494ed008d595bd")
            
        }
        catch(err) {
            error.message = err.message;
            expect(error.message).toEqual("no such table exists");
        }
        let result2 = await db_table.GetAllTables();
        // assert

        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });

    test('DeleteTable throws error when given id with incorrect type', async () =>{
        // assume
        let new_table = {
            Name: "stolik1", 
            Capacity: 5,
            Status: "zajęty",
            Order: 
            {
                Employee : 
                [{
                    Name: "jan",
                    Surename: "kowalski",
                    Position: "kelner"
                }],
                Dishes : 
                [{
                    Name: "grochówka",
                    Price: 16,
                    Category: "zupy"
                },
                {
                    Name: "kotlet z ziemniakami",
                    Price: 34,
                    Category: "dania główne"
                }],
                Status: "oczekujący",
                Creation_date: "2018-12-10T13:45:00.000",
                Bill: 50
            }
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_table.DeleteTable("wrong")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("Cast to ObjectId failed for value \"wrong\" (type string) at path \"_id\" for model \"Table\"");
    });
});