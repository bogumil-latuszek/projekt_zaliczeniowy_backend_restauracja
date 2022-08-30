import { Reservation } from './model';
import { IReservationAccess } from './idata_access';
import { Schema, model, connect, Model } from 'mongoose';
import {Mongo_Reservation } from './mongo_models';
import config from './config';


let dbConnectingStarted: Boolean = false;

export function setupDBConnection() {
    if (!dbConnectingStarted) {
        dbConnectingStarted = true;
        connect(config.MONGO_URI)
        .then(() => {
            console.log("MongoDB started");
        })
        .catch(e => {
            console.log(e);
        });
    }
}

class DbReservation implements IReservationAccess {

    constructor() {}

    async HasReservation(id: string): Promise<boolean> {
        const reservation = await Mongo_Reservation.findById(id).lean();
        if(reservation == undefined)
        {
            return Promise.resolve(false);
        }
        else 
        {
            return Promise.resolve(true);
        }
    }

    async GetReservation(id: string): Promise<Reservation | undefined> {
        return Mongo_Reservation.findOne({ id }).lean();
    }
    
    async GetAllReservations(): Promise<Reservation[]>{
        let reservations_empty = Mongo_Reservation.find({});
        return Promise.resolve(reservations_empty);
    }

    async AddReservation(reservation:Reservation): Promise<Reservation>{
        return Promise.resolve(reservation);//not working as intended
    }

    async UpdateReservation(reservation: Reservation): Promise<void> {
        /*let id = reservation.id
        let retrived_reservation = await Mongo_Reservation.findOne({ id });
        if(retrived_reservation != undefined)
        {
            retrived_reservation.Client_Name = reservation.Client_Name; 
            retrived_reservation.Time_Start = reservation.Time_Start;
            retrived_reservation.Time_End = reservation.Time_End;
            retrived_reservation.Table_Id = reservation.Table_Id;
            await retrived_reservation.save();
        }
        */
        return Promise.resolve();
    }

    async DeleteReservation(id: string): Promise<void> {
        let retrived_reservation = await Mongo_Reservation.findOne({ id });
        retrived_reservation?.deleteOne({_id: id})
        return Promise.resolve();
    }
}

export {  DbReservation };