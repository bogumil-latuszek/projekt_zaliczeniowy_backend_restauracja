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
