import { Dish, Reservation, Product, Restaurant, Employee, Table, Order } from 'model';
import {  IDishAccess, IReservationAccess, IProductAccess, IRestaurantAccess, IEmployeeAccess, ITableAccess, IOrderAccess} from 'idata_access';
import mongoose from "mongoose";
import {Mongo_Dish, Mongo_Reservation, Mongo_Product, Mongo_Restaurant, Mongo_Employee, Mongo_Table, Mongo_Order} from 'mongo_models';
import config from 'config';
import { readConfigFile } from 'typescript';



let db_connection;

export async function connectDB() {
    try {
        db_connection = await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connect error");
    }
}

export function disconnectDB() {
    try {
        if (db_connection) {
            db_connection.disconnect();
            db_connection = null;
            console.log("MongoDB disconnected");
        }
    } catch (error) {
        console.log("MongoDB disconnect error");
    }
}

export async function connectDBForTesting() {
    try {
        await mongoose.connect(config.MONGO_TEST_URI);
    } catch (error) {
        console.log("DB:test connect error");
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.log("DB:test disconnect error");
    }
}

export async function clearDB() {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({})
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
            originalReservation.TableName = reservation.TableName;
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
        try{
            await Mongo_Dish.findByIdAndDelete(id);
            return Promise.resolve();
        }
        catch(err){
            return Promise.resolve();
        }
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
        let products: Product[] = await Mongo_Product.find()
        return Promise.resolve(products);
    }

    async GetSelectedProducts(sorted_by: string, offset: number = 0, limit: number = 10): Promise<Product[]> {
        let sort_by = {}
        if (sorted_by.toLowerCase() == "price") {
            sort_by = {Price: "asc"}
        }
        else if (sorted_by.toLowerCase() == "quantity") {
            sort_by = {Quantity: "asc"}
        }
        else if (sorted_by.toLowerCase() == "measurement_units") {
            sort_by = {Measurement_Units: "asc"}
        }
        else {
            sort_by = {Name: "asc"}  // default
        }

        let products: Product[] = await Mongo_Product.find().sort(sort_by).skip(offset).limit(limit)
        return Promise.resolve(products);
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
            await originalTable.save()
        }
        else{
            throw new Error("no such table exists")}
        return Promise.resolve();
    };

    async DeleteTable(id:string): Promise<void> {
        try{
            await Mongo_Table.findByIdAndDelete(id);
            return Promise.resolve();
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
    async GetEmployeeDbId(corporate_id: string): Promise<string | null> {
        try {
            let existing_employee = await Mongo_Employee.findOne({CorporateID: corporate_id});
            if (existing_employee == null) { // employee or null
                return Promise.resolve(null);
            }
            return Promise.resolve(existing_employee._id.toString());
        }
        catch (error){
            return Promise.resolve(null);
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
            originalEmployee.CorporateID = employee.CorporateID;
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
        try{
            await Mongo_Employee.findByIdAndDelete(id);
            return Promise.resolve();
        }
        catch(err){
            return Promise.resolve();
        }
    }
}

class MongoDbRestaurants implements IRestaurantAccess {
    async HasRestaurant(id: string): Promise<boolean> {
        try {
            let existing_restaurant = await Mongo_Restaurant.findById(id);

            if (existing_restaurant) { // restaurant or null
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
    async GetRestaurant(id: string): Promise<Restaurant>  {
        try {
            let existing_restaurant = await Mongo_Restaurant.findById(id);
            if (existing_restaurant == null) { // restaurant or null
                throw new  Error("no restaurant found for given id");
            }
            return Promise.resolve(existing_restaurant);
        }
        catch (error){
            throw new  Error("no restaurant found for given id");
        }
    }
    async GetAllRestaurants(): Promise<Restaurant[]> {
        let restaurants: Restaurant[] = await Mongo_Restaurant.find()
        return Promise.resolve(restaurants);
    }
    async AddRestaurant(restaurant: Restaurant): Promise<string> {
        const mongo_restaurant = new Mongo_Restaurant({ ...restaurant });
        const createdRestaurant = await mongo_restaurant.save();
        return Promise.resolve(createdRestaurant.id);
    }
    async UpdateRestaurant(restaurant: Restaurant, id: string): Promise<void> {
        let originalRestaurant = await Mongo_Restaurant.findById(id);
        if (originalRestaurant != null) {
            originalRestaurant.Name = restaurant.Name;
            originalRestaurant.Address = restaurant.Address;
            originalRestaurant.Phone = restaurant.Phone;
            originalRestaurant.nip = restaurant.nip;
            originalRestaurant.email = restaurant.email;
            originalRestaurant.website = restaurant.website;
            await originalRestaurant.save()
        }
        else {
            throw new Error("no such restaurant exists")
        }
        return Promise.resolve();
    }
    async DeleteRestaurant(id:string): Promise<void> {
        try{
            await Mongo_Restaurant.findByIdAndDelete(id);
            return Promise.resolve();
        }
        catch(err){
            return Promise.resolve();
        }

    }
}

class MongoDbOrders implements IOrderAccess {
    
    async HasOrder(order_id: string): Promise<boolean> {
        try {
            let existing_order = await Mongo_Order.findById(order_id);
            if (existing_order == null) { // order or null
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error){
            return Promise.resolve(false);
        }
    }
    async GetOrder(order_id: string): Promise<Order | undefined> { // null
        try {
            let existing_order = await Mongo_Order.findById(order_id);
            if (existing_order == null) { // order or null
                return Promise.resolve(undefined); //null
            }
            return Promise.resolve(existing_order);
        }
        catch (error){
            return Promise.resolve(undefined);
        }
    }
    async GetAllOrders(): Promise<Order[]> {
        let orders: Order[] = await Mongo_Order.find()
        return Promise.resolve(orders);
    }
    async GetOrdersForTable(table_name: string): Promise<Order[]> {
        let orders4table: Order[] = await Mongo_Order.find({TableName: table_name})
        return Promise.resolve(orders4table);
    }
    async GetOrdersTakenByEmployee(employee_id: string): Promise<Order[]> {
        let orders_by_employee: Order[] = await Mongo_Order.find({EmployeeID: employee_id})
        return Promise.resolve(orders_by_employee);
    }
    async AddOrder(order:Order): Promise<string> {
        const mongo_order = new Mongo_Order({ ...order });
        const createdOrder = await mongo_order.save();
        return Promise.resolve(createdOrder.id); 
    }
    async UpdateOrder(order_id: string, order: Order): Promise<void> {
        let originalOrder = await Mongo_Order.findById(order_id);
        if (originalOrder != null) {
            originalOrder.TableName = order.TableName;
            originalOrder.EmployeeID = order.EmployeeID;
            originalOrder.DishesNames = order.DishesNames;
            originalOrder.Status = order.Status;
            originalOrder.Creation_date = order.Creation_date;
            originalOrder.Bill = order.Bill;
            await originalOrder.save()
        }
        else {
            throw new Error("no such order exists")
        }
        return Promise.resolve();
    }
    async DeleteOrder(order_id: string): Promise<void> {
        try {
            await Mongo_Order.findByIdAndDelete(order_id);
            return Promise.resolve();
        }
        catch(err) {
            return Promise.resolve();
        }
    }
}
export { MongoDbDishes, MongoDbReservation, MongoDbProducts, MongoDbTables, MongoDbEmployees, MongoDbRestaurants, MongoDbOrders};