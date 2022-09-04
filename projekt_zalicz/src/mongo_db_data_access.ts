import { Dish, Reservation, Product, Restaurant, Employee, Table, Order } from 'model';
import {  IDishAccess, IReservationAccess, IProductAccess, IRestaurantAccess, IEmployeeAccess, ITableAccess, IOrderAccess} from 'idata_access';
import mongoose from "mongoose";
import {Mongo_Dish, Mongo_Reservation, Mongo_Product, Mongo_Restaurant, Mongo_Employee, Mongo_Table} from 'mongo_models';
import config from 'config';

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

    async HasReservation(_id:string): Promise<boolean> {
        try {
            let existing_doc = await Mongo_Reservation.findById(_id);

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
    async GetReservation(_id:string): Promise<Reservation> {
        try {
            let existing_doc = await Mongo_Reservation.findById(_id);
            if (existing_doc == null) { //doc or null
                throw new  Error("no reservation found for given id");
            }
            return Promise.resolve(existing_doc);
        }
        catch (error){
            throw new  Error("no reservation found for given id");
        }
    }
    async GetAllReservations(): Promise<Reservation[]> {
        let reservationes: Reservation[] = await Mongo_Reservation.find()
        return Promise.resolve(reservationes);
    }

    async AddReservation(reservation: Reservation): Promise<string> {
        try {
            const mongo_reservation = new Mongo_Reservation({ ...reservation });
            const createdReservation = await mongo_reservation.save();
            return Promise.resolve(createdReservation.id);
        } catch (err) {
            console.log(err);
        }
    }

    async UpdateReservation(reservation:Reservation, _id:string): Promise<void> {
        let originalReservation = await Mongo_Reservation.findOne({_id});
        if(originalReservation != undefined){
            originalReservation.Client_Name = reservation.Client_Name;
            originalReservation.Table_Id = reservation.Table_Id;
            originalReservation.Time_Start = reservation.Time_Start;
            originalReservation.Time_End = reservation.Time_End;
            await originalReservation.save()
        }
        else{
            throw new Error("no such reservation exists")}
        return Promise.resolve();
    };

    async DeleteReservation(id:string): Promise<void> {
        try{
            await Mongo_Reservation.findByIdAndDelete(id);
            return Promise.resolve();
        }
        catch(err){
            return Promise.resolve();
        }
    };
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
            return Promise.resolve(createdDish.id);
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

class MongoDbProducts implements IProductAccess {

    async HasProduct(_id:string): Promise<boolean> {
        try {
            let existing_doc = await Mongo_Product.findById(_id);

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
    async GetProduct(_id:string): Promise<Product> {
        try {
            let existing_doc = await Mongo_Product.findById(_id);
            if (existing_doc == null) { //doc or null
                throw new  Error("no product found for given id");
            }
            return Promise.resolve(existing_doc);
        }
        catch (error){
            throw new  Error("no product found for given id");
        }
    }
    async GetAllProducts(): Promise<Product[]> {
        let productes: Product[] = await Mongo_Product.find()
        return Promise.resolve(productes);
    }

    async AddProduct(product: Product): Promise<string> {
        try {
            const mongo_product = new Mongo_Product({ ...product });
            const createdProduct = await mongo_product.save();
            return Promise.resolve(createdProduct.id);
        } catch (err) {
            console.log(err);
        }
    }

    async UpdateProduct(product:Product, _id:string): Promise<void> {
        let originalProduct = await Mongo_Product.findOne({_id});
        if(originalProduct != undefined){
            originalProduct.Name = product.Name;
            originalProduct.Price = product.Price;
            originalProduct.Quantity = product.Quantity;
            originalProduct.Measurement_Units = product.Measurement_Units;
            await originalProduct.save()
        }
        else{
            throw new Error("no such product exists")}
        return Promise.resolve();
    };

    async DeleteProduct(id:string): Promise<void> {
        try{
            await Mongo_Product.findByIdAndDelete(id);
            return Promise.resolve();
        }
        catch(err){
            return Promise.resolve();
        }
    };
}


class MongoDbTables implements ITableAccess {

    FindFreeTable(): Promise<Table> {
        throw new Error('Method not implemented.');
    }

    async HasTable(_id:string): Promise<boolean> {
        try {
            let existing_doc = await Mongo_Table.findById(_id);

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
    async GetTable(_id:string): Promise<Table> {
        try {
            let existing_doc = await Mongo_Table.findById(_id);
            if (existing_doc == null) { //doc or null
                throw new  Error("no table found for given id");
            }
            return Promise.resolve(existing_doc);
        }
        catch (error){
            throw new  Error("no table found for given id");
        }
    }
    async GetAllTables(): Promise<Table[]> {
        let tablees: Table[] = await Mongo_Table.find()
        return Promise.resolve(tablees);
    }

    async AddTable(table: Table): Promise<string> {
        try {
            const mongo_table = new Mongo_Table({ ...table });
            const createdTable = await mongo_table.save();
            return Promise.resolve(createdTable.id);
        } catch (err) {
            console.log(err);
        }
    }

    async UpdateTable(table:Table, _id:string): Promise<void> {
        let originalTable = await Mongo_Table.findOne({_id});
        if(originalTable != undefined){
            originalTable.Name = table.Name;
            originalTable.Capacity = table.Capacity;
            originalTable.Status = table.Status;
            originalTable.Order = table.Order;
            await originalTable.save()
        }
        else{
            throw new Error("no such table exists")}
        return Promise.resolve();
    };

    async DeleteTable(id:string): Promise<void> {
        try{
            await Mongo_Table.findByIdAndDelete(id);
        }
        catch(err){
            return Promise.resolve();
        }
    };
}

class MongoDbEmployees implements IEmployeeAccess {
    async HasEmployee(id: string): Promise<boolean> {
        try {
            let existing_employee = await Mongo_Employee.findById(id);

            if (existing_employee) { // employee or null
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
    async GetEmployee(id: string): Promise<Employee>  {
        try {
            let existing_employee = await Mongo_Employee.findById(id);
            if (existing_employee == null) { // employee or null
                throw new  Error("no employee found for given id");
            }
            return Promise.resolve(existing_employee);
        }
        catch (error){
            throw new  Error("no employee found for given id");
        }
    }
    async GetAllEmployees(): Promise<Employee[]> {
        let employees: Employee[] = await Mongo_Employee.find()
        return Promise.resolve(employees);
    }
    async AddEmployee(employee: Employee): Promise<string> {
        const mongo_employee = new Mongo_Employee({ ...employee });
        const createdEmployee = await mongo_employee.save();
        return Promise.resolve(createdEmployee.id);
    }
    async UpdateEmployee(employee: Employee, id: string): Promise<void> {
        let originalEmployee = await Mongo_Employee.findById(id);
        if (originalEmployee != null) {
            originalEmployee.Name = employee.Name;
            originalEmployee.Surename = employee.Surename;
            originalEmployee.Position = employee.Position;
            await originalEmployee.save()
        }
        else {
            throw new Error("no such employee exists")
        }
        return Promise.resolve();
    }
    async DeleteEmployee(id:string): Promise<void> {
        await Mongo_Employee.findByIdAndDelete(id);
        return Promise.resolve();
    }
}

export {  MongoDbDishes, MongoDbReservation, MongoDbProducts, MongoDbTables, MongoDbEmployees };