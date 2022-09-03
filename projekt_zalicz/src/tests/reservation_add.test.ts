import { DbReservation, connectDBForTesting, disconnectDBForTesting } from 'mongo_db_data_access'

test('db connection test2', async () =>{
    await connectDBForTesting();
    let db_reserv = new DbReservation;
    expect(db_reserv.HasReservation("this is obviously not an id")).toEqual(false);
    await disconnectDBForTesting();
} )