import {
    connectDBForTesting,
    disconnectDBForTesting,
} from "mongo_db_data_access";

import { Reservation } from "model"
import {  Mongo_Reservation } from "mongo_models"
import { getReservationAccess } from "data_access_selector"

describe("HasReservation Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('HasReservation returns false when asked for non existant id', async () =>{
        //act
        let result = await db_reservation.HasReservation("56e6dd2eb4494ed008d595bd");
        //assert
        expect(result).toEqual(false);
    });

    test('HasReservation returns false when asked for id with wrong structure', async () =>{
        //act
        let result = await db_reservation.HasReservation("wrong");
        //assert
        expect(result).toEqual(false);
    });

    test('HasReservation returns true when asked for existing id', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        // act
        let result = await db_reservation.HasReservation(new_reservation_id);
        // assert
        expect(result).toEqual(true);
    });
});

describe("GetReservation Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetReservation returns existing reservation when given its id', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        // act
        let result = await db_reservation.GetReservation(new_reservation_id);
        // assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result.Table_Id).toEqual(new_reservation.Table_Id);
        expect(result.Time_Start).toEqual(new_reservation.Time_Start);
        expect(result.Time_End).toEqual(new_reservation.Time_End);
        expect(result.Client_Name).toEqual(new_reservation.Client_Name);
    });

    test('GetReservation throws error when given id of nonexisting reservation', async () =>{
        try{
            //act
            let result = await db_reservation.GetReservation("56e6dd2eb4494ed008d595bd");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no reservation found for given id");
        }
        
    });

    test('GetReservation throws error when given id in inappropriate format', async () =>{
        try{
            //act
            let result = await db_reservation.GetReservation("wrong format");
        }
        catch (err) {
            //assert
            expect(err.message).toEqual("no reservation found for given id");
        }
        
    });
});

describe("GetAllReservations Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('GetAllReservations returns all existing reservationes', async () =>{
        // assume
        let new_reservation1 = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation1_id  = await db_reservation.AddReservation(new_reservation1);
        let new_reservation2 = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation2_id  = await db_reservation.AddReservation(new_reservation2);
        // act
        let result = await db_reservation.GetAllReservations();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).not.toEqual(result[1]);
    });

    test('GetAllReservations returns empty array when there arent any reservationes', async () =>{
        // act
        let result = await db_reservation.GetAllReservations();
        // assert
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });
});

describe("AddReservation Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('AddReservation returns id of newly created reservation', async () => {
        //assume
        const sprite: Reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        const reservationDataAccess = getReservationAccess();
        //act
        const createdReservation_id = await reservationDataAccess.AddReservation(sprite);
        //assert
        expect(createdReservation_id).toBeDefined();
    });

    test('AddReservation returns valid id when given object that is a Reservation', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        // act
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        let new_reservation_in_db = await db_reservation.GetReservation(new_reservation_id);
        // assert
        expect(new_reservation_in_db).toBeDefined();
        expect(new_reservation_in_db.Table_Id).toEqual(new_reservation.Table_Id);
        expect(new_reservation_in_db.Time_Start).toEqual(new_reservation.Time_Start);
        expect(new_reservation_in_db.Time_End).toEqual(new_reservation.Time_End);
        expect(new_reservation_in_db.Client_Name).toEqual(new_reservation.Client_Name);
    });

    test('AddReservation returns valid id when given object that is a Reservation but has more fields', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan",
            additionalField1: "sdjflasjtwg4ds9",
            additionalField2: "sdjflasdsfafdasj"
        }
        // act
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        let new_reservation_in_db = await db_reservation.GetReservation(new_reservation_id);
        // assert
        expect(new_reservation_in_db).toBeDefined();
        expect(new_reservation_in_db.Table_Id).toEqual(new_reservation.Table_Id);
        expect(new_reservation_in_db.Time_Start).toEqual(new_reservation.Time_Start);
        expect(new_reservation_in_db.Time_End).toEqual(new_reservation.Time_End);
        expect(new_reservation_in_db.Client_Name).toEqual(new_reservation.Client_Name);
    });

});

describe("UpdateReservation Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('UpdateReservation updates reservation in db when given id of existing reservation', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        let newer_reservation = {
            Table_Id : "56e6dd2eb4494ed008d594cc",
            Time_Start : "2019-12-10T13:45:00.000",
            Time_End : "2019-12-10T15:00:00.000",
            Client_Name : "paweł"
        }
        // act
        await db_reservation.UpdateReservation(newer_reservation, new_reservation_id);
        let second_reservation_in_db = await db_reservation.GetReservation(new_reservation_id);
        // assert
        expect(second_reservation_in_db).toBeDefined();
        expect(second_reservation_in_db.Table_Id).toEqual("56e6dd2eb4494ed008d594cc");
        expect(second_reservation_in_db.Time_Start).toEqual("2019-12-10T13:45:00.000");
        expect(second_reservation_in_db.Time_End).toEqual("2019-12-10T15:00:00.000");
        expect(second_reservation_in_db.Client_Name).toEqual("paweł");
    });

    test('UpdateReservation throws error when given id of nonexisting reservation', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let error = new Error("nothing for now")
        // act
        try{
            await db_reservation.UpdateReservation(new_reservation, "56e6dd2eb4494ed008d595bd")
        }
        catch(err) {
            error.message = err.message;
        }
        // assert
        expect(error.message).toEqual("no such reservation exists");
    });

    test('UpdateReservation throws error when given id with incorrect type', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        // act
        try{
            await db_reservation.UpdateReservation(new_reservation, "wrong type")
        }
        catch(err) {
            // assert
            expect(err.message).toEqual("Cast to ObjectId failed for value \"wrong type\" (type string) at path \"_id\" for model \"Reservation\"");
        }
    });


});

describe("DeleteReservation Testing", () => {
    let db_reservation = getReservationAccess();

    beforeAll(async () => {
        await connectDBForTesting();
    });
    
    afterAll(async () => {
        await disconnectDBForTesting();
    });

    afterEach(async () => {
        try {
            await Mongo_Reservation.collection.drop();
        }
        catch (err) {
            // ignore exception thrown from dropping nonexistent collection
            if (err.message !== 'ns not found') {
                throw err;
            }
        }
    });

    test('DeleteReservation deletes reservation in db when given id of existing reservation', async () =>{
        // assume
        let new_reservation = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation_id  = await db_reservation.AddReservation(new_reservation);
        // act
        await db_reservation.DeleteReservation(new_reservation_id);
        let new_reservation_exists_in_db = await db_reservation.HasReservation(new_reservation_id);
        // assert
        expect(new_reservation_exists_in_db).toEqual(false)
    });

    test('DeleteReservation doesnt change db at all when given id of nonexisting reservation, and doesnt throw any errors', async () =>{
        //assume
        let new_reservation1 = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation1_id  = await db_reservation.AddReservation(new_reservation1);
        let new_reservation2 = {
            Table_Id : "56e6dd2eb4494ed008d594cc",
            Time_Start : "2019-12-10T13:45:00.000",
            Time_End : "2019-12-10T15:00:00.000",
            Client_Name : "paweł"
        }
        let new_reservation2_id  = await db_reservation.AddReservation(new_reservation2);
        let result1 = await db_reservation.GetAllReservations();
        // act
        await db_reservation.DeleteReservation("56e6dd2eb4494ed008d595bd")
            
        let result2 = await db_reservation.GetAllReservations();
        // assert

        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });

    test('DeleteReservation doesnt change db at all when given id in wrong notation, and doesnt throw any errors', async () =>{
        //assume
        let new_reservation1 = {
            Table_Id : "56e6dd2eb4494ed008d595bd",
            Time_Start : "2018-12-10T13:45:00.000",
            Time_End : "2018-12-10T15:00:00.000",
            Client_Name : "jan"
        }
        let new_reservation1_id  = await db_reservation.AddReservation(new_reservation1);
        let new_reservation2 = {
            Table_Id : "56e6dd2eb4494ed008d594cc",
            Time_Start : "2019-12-10T13:45:00.000",
            Time_End : "2019-12-10T15:00:00.000",
            Client_Name : "paweł"
        }
        let new_reservation2_id  = await db_reservation.AddReservation(new_reservation2);
        let result1 = await db_reservation.GetAllReservations();
        // act
        await db_reservation.DeleteReservation("wrong id")
            
        let result2 = await db_reservation.GetAllReservations();
        // assert

        expect(result2).toBeDefined();
        expect(result1.length).toEqual(result2.length);
    });
});