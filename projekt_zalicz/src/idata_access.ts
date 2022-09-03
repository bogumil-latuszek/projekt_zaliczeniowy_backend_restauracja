import {Employee, Restaurant, Reservation, Table, Order, Product, Dish} from './model';

interface IEmployeeAccess {
    HasEmployee(id:string): Promise<boolean>;
    GetEmployee(id:string): Promise<Employee | undefined>;
    GetAllEmployees(): Promise<Employee[]>;
    AddEmployee(Employee:Employee): Promise<Employee>;
    UpdateEmployee(Employee:Employee): Promise<void>;
    DeleteEmployee(id:string): Promise<void>;
}

interface IRestaurantAccess {
    HasRestaurant(id:string): Promise<boolean>;
    GetRestaurant(id:string): Promise<Restaurant | undefined>;
    AddRestaurant(Restaurant:Restaurant): Promise<Restaurant>;
    UpdateRestaurant(Restaurant:Restaurant): Promise<void>;
    DeleteRestaurant(id:string): Promise<void>;
}

interface IReservationAccess {
    HasReservation(id:string): Promise<boolean>;
    GetReservation(id:string): Promise<Reservation | undefined>;
    GetAllReservations(): Promise<Reservation[]>;
    UpdateReservation(Reservation:Reservation): Promise<void>;
    DeleteReservation(id:string): Promise<void>;
}

interface ITableAccess {
    HasTable(id:string): Promise<boolean>;
    GetTable(id:string): Promise<Table | undefined>;
    GetAllTables(): Promise<Table[]>;
    AddTable(Table:Table): Promise<Table>;
    UpdateTable(Table:Table): Promise<void>;
    DeleteTable(id:string): Promise<void>;
    FindFreeTable(): Promise<Table | undefined>;
    //RaportTables(): Promise<Table[]>;
}

interface IOrderAccess {
    HasOrder(id:string): Promise<boolean>;
    GetOrder(id:string): Promise<Order | undefined>;
    GetAllOrders(): Promise<Order[]>;
    AddOrder(Order:Order): Promise<Order>;
    UpdateOrder(Order:Order): Promise<void>;
    DeleteOrder(id:string): Promise<void>;
    FindFreeOrder(): Promise<Order | undefined>;
    //RaportOrders(): Promise<Order[]>;
}

interface IProductAccess {
    HasProduct(id:string): Promise<boolean>;
    GetProduct(id:string): Promise<Product | undefined>;
    GetAllProducts(): Promise<Product[]>;
    AddProduct(Product:Product): Promise<Product>;
    UpdateProduct(Product:Product): Promise<void>;
    DeleteProduct(id:string): Promise<void>;
}

interface IDishAccess {
    HasDish(id:string): Promise<boolean>;
    GetDish(id:string): Promise<Dish | undefined>;
    GetAllDishes(): Promise<Dish[]>;
    AddDish(dish:Dish): Promise<string>;
    UpdateDish(Dish:Dish): Promise<void>;
    DeleteDish(id:string): Promise<void>;
}

export { IEmployeeAccess, IRestaurantAccess, IReservationAccess, 
    ITableAccess, IOrderAccess, IProductAccess, IDishAccess };
