import { DbReservation, setupDBConnection } from '../db_data_access'

test('db connection test2', () =>{
    setupDBConnection();
    let db_reserv = new DbReservation;
    expect(db_reserv.HasReservation("this is obviously not an id")).toEqual(false);
} )
