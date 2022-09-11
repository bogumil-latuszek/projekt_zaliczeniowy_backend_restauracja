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

router.get('/:id', async (req: Request, res: Response) => {
    let searching_id = req.params.id
    let reservation_exists = await db_reservation.HasReservation(searching_id);
    if(reservation_exists){
        let reservation: Reservation = await db_reservation.GetReservation(searching_id)
        res.status(200).send(reservation);
    }
    else{
        res.status(404).send(`reservation with id=${searching_id} doesn't exist`);
    }
})

router.post('/', async(req:Request, res: Response) =>{
    try {
        let reservation: Reservation = req.body
        let newly_added_id = await db_reservation.AddReservation(reservation);
        res.status(201).send({'id': newly_added_id});
    }
    catch(err){
        res.status(500).send(`error: ${err.message}`);
    }
})

router.put('/:id', async(req:Request, res: Response) =>{
    try{
        let searching_id = req.params.id
        let reservation: Reservation = req.body
        let newly_added_id = await db_reservation.UpdateReservation(reservation, searching_id);
    }
    catch(err){
        res.status(400).send(`error: ${err}`);
    }
    res.status(204).send({})  // 204 - no content
 })

 router.delete('/:id', async(req:Request, res: Response) =>{
    let searching_id = req.params.id
    let reservation_exists = await db_reservation.HasReservation(searching_id);
    if(reservation_exists){
        await db_reservation.DeleteReservation(searching_id);
        res.status(204).send({})  // 204 - no content
    }
    else{
        res.status(404).send(`reservation with id=${searching_id} doesn't exist`);
    }
 })