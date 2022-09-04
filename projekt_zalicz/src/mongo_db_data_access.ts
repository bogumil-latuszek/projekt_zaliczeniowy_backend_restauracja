import { Dish, Reservation } from 'model';
import { IReservationAccess } from 'idata_access';
import mongoose from "mongoose";
import {Mongo_Dish, Mongo_Reservation } from 'mongo_models';
import config from 'config';
import { IDishAccess } from "idata_access";

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


class MongoDbReservation implements IReservationAccess {

    constructor() {}

    async HasReservation(id: string): Promise<boolean> {
        const reservation = await Mongo_Reservation.findById(id).lean();
        //if id is a string but not in a certain way this returns error not false
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

// ---------------- Dish

class MongoDbDishes implements IDishAccess {

    async HasDish(_id:string): Promise<boolean> {
        try {
            let existing_doc = await Mongo_Dish.findById(_id);

            if (existing_doc) { //doc or null
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            };
        }
        catch (error){
            return Promise.resolve(false);
        }
    }
    async GetDish(_id:string): Promise<Dish> {
        try {
            let existing_doc = await Mongo_Dish.findById(_id);
            if (existing_doc == null) { //doc or null
                throw new  Error("no dish found for given id");
            }
            return Promise.resolve(existing_doc);
        }
        catch (error){
            throw new  Error("no dish found for given id");
        }
    }
    async GetAllDishes(): Promise<Dish[]> {
        let dishes: Dish[] = await Mongo_Dish.find()
        return Promise.resolve(dishes);
    }

    async AddDish(dish: Dish): Promise<string> {
        try {
            const mongo_dish = new Mongo_Dish({ ...dish });
            const createdDish = await mongo_dish.save();
            return createdDish.id;
        } catch (err) {
            console.log(err);
        }
    }

    async UpdateDish(dish:Dish, _id:string): Promise<void> {
        let originalDish = await Mongo_Dish.findOne({_id});
        if(originalDish != undefined){
            originalDish.Name = dish.Name;
            originalDish.Price = dish.Price;
            originalDish.Category = dish.Category;
            await originalDish.save()
        }
        else{
            throw new Error("no such dish exists")}
        return Promise.resolve();
    };

    async DeleteDish(id:string): Promise<void> {
        await Mongo_Dish.findByIdAndDelete(id);
        return Promise.resolve();
    };
}

export {  MongoDbDishes };


export {  MongoDbReservation};