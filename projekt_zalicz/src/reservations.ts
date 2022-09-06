import express from 'express';
import {Request, Response} from 'express';
import {IReservationAccess} from "idata_access"
import {getReservationAccess} from 'data_access_selector'
import {Reservation} from 'model';

const  router = express.Router()
export default router

let db_reservation: IReservationAccess = getReservationAccess();

router.get('/', async (req: Request, res: Response) => {

    let all_reservations: Reservation[] = await db_reservation.GetAllReservations();
    res.status(200).send(all_reservations);
})
