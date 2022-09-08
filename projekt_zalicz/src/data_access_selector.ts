/* this file works as factory
   returning proper variant of data access layer
   (curently we have only MongoDB data access)
*/
import { IDishAccess, IProductAccess, ITableAccess, IEmployeeAccess, IReservationAccess, IRestaurantAccess, IOrderAccess} from "idata_access"
import { MongoDbDishes, MongoDbProducts, MongoDbTables, MongoDbEmployees, MongoDbReservation, MongoDbRestaurants, MongoDbOrders, connectDB, disconnectDB, clearDB} from "mongo_db_data_access"
import config from 'config';

let selectedDataStorage = config.DATA_STORAGE_VARIANT;


export async function initDataAccess() {
    if (selectedDataStorage == "mongodb") {
        await connectDB();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function dropDataAccess() {
    if (selectedDataStorage == "mongodb"){
        disconnectDB();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export async function clearAllData() {
    if (selectedDataStorage == "mongodb") {
        await clearDB();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getDishesAccess(): IDishAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbDishes();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getProductsAccess(): IProductAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbProducts();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getTablesAccess(): ITableAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbTables();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getEmployeeAccess(): IEmployeeAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbEmployees();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getReservationAccess(): IReservationAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbReservation();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getRestaurantAccess(): IRestaurantAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbRestaurants();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
}

export function getOrdersAccess(): IOrderAccess {
    if (selectedDataStorage == "mongodb"){
        return new MongoDbOrders();
    }
    else{
        throw new Error(`${selectedDataStorage} is not a valid storage variant`);
    }
 }
