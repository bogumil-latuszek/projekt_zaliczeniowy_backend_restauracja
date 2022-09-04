/* this file works as factory
   returning proper variant of data access layer
   (curently we have only MongoDB data access)
*/
import { IDishAccess, IProductAccess, ITableAccess} from "idata_access"
import { MongoDbDishes, MongoDbProducts, MongoDbTables} from "mongo_db_data_access"
import config from 'config';

let selectedDataStorage = config.DATA_STORAGE_VARIANT;


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