import { Schema, model, Model } from 'mongoose';
import {Employee, Restaurant, Reservation, Table, Product, Dish, Order} from './model';

const ReservationSchema = new Schema<Reservation> ({
    Table_Id : {type: String, required: true},
    Time_Start :  {type: String, required: true},
    Time_End :  {type: String, required: true},
    Client_Name :  {type: String, required: true},
})

const EmployeeSchema = new Schema<Employee>({
    // _id is auto-populated by mongoose
    Name: {type: String, required: true},
    Surename: {type: String, required: true},
    Position: {type: String, required: true},
});

const DishSchema = new Schema<Dish>({
    Name: {type: String, required: true},
    Price: {type: Number, required: true},
    Category: {type: String, required: true},
})

const OrderSchema = new Schema<Order>({
    Table_Id : {type: String, required: true},
    _Employee : {type: EmployeeSchema, required: true},
    Dishes : {type: [DishSchema], required: true},
    Status: {type: String, required: true}, //could use enum
    Creation_date: {type: String, required: true},
    Bill: {type: Number, required: true}
})

const TableSchema = new Schema<Table>({
    Name: {type: String, required: false},
    Capacity: {type: Number, required: true},
    Status: {type: String, required: true}, //could use enum
    Orders: [OrderSchema]
})

const RestaurantSchema = new Schema<Restaurant> ({
    Name: {type: String, required: true},
    Address: {type: String, required: true},
    Phone: {type: String, required: true},
    nip: {type: String, required: true},
    email: {type: String, required: true},
    website: {type: String, required: false},
})

const ProductSchema = new Schema<Product> ({
    Name: {type: String, required: true},
    Price: {type: Number, required: true},
    Quantity: {type: Number, required: true},
    Measurement_Units: {type: String, required: true},
})

const Mongo_Reservation: Model<Reservation> = model<Reservation>('Reservation', ReservationSchema);
const Mongo_Employee: Model<Employee> = model<Employee>('Employee', EmployeeSchema);
const Mongo_Dish: Model<Dish> = model<Dish>('Dish', DishSchema);
const Mongo_Table: Model<Table> = model<Table>('Table', TableSchema);
const Mongo_Restaurant: Model<Restaurant> = model<Restaurant>('Restaurant', RestaurantSchema);
const Mongo_Product: Model<Product> = model<Product>('Product', ProductSchema);

export {Mongo_Reservation, Mongo_Employee, Mongo_Dish, Mongo_Table, Mongo_Restaurant, Mongo_Product}