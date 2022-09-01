import { Reservation } from 'model';
import { IReservationAccess } from 'idata_access';
import mongoose from "mongoose";
import {Mongo_Reservation } from 'mongo_models';
import config from 'config';

let dbConnectingStarted: Boolean = false;

export function setupDBConnection() {
    if (!dbConnectingStarted) {
        dbConnectingStarted = true;
        mongoose.connect(config.MONGO_URI)
        .then(() => {
            dbConnectingStarted = false;
            console.log("MongoDB started");
        })
        .catch(e => {
            dbConnectingStarted = false;
            console.log("Connecting MongoDB failed");
            console.log(e);
        });
    }
}

export function teardownDBConnection() {
    mongoose.connection.close()
    .then(() => {
        console.log("MongoDB connection closed");
    })
    .catch(e => {
        console.log("Closing MongoDB connection failed");
        console.log(e);
    });
}

export async function connectDBForTesting() {
    try {
        await mongoose.connect(config.MONGO_TEST_URI);
        console.log("DB:test started");
    } catch (error) {
        console.log("DB:test connect error");
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.close();
        console.log("DB:test disconnected");
    } catch (error) {
        console.log("DB:test disconnect error");
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