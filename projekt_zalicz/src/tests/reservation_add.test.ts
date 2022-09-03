import { DbReservation, connectDBForTesting, disconnectDBForTesting } from 'mongo_db_data_access'
import { Mongo_Reservation } from 'mongo_models';


describe("ReservationModel Testing", () => {
    beforeAll(async () => {
        await connectDBForTesting();
    });
  
    afterAll(async () => {
        //await Mongo_Reservation.collection.drop();
        await disconnectDBForTesting();
    });

    test('HasReservation returns false when asked for non existant id', async () =>{
        let db_reserv = new DbReservation;

        let result = await db_reserv.HasReservation("56e6dd2eb4494ed008d595bd");
        expect(result).toEqual(false);
    });
});
