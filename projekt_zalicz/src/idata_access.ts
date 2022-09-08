import {Employee, Restaurant, Reservation, Table, Order, Product, Dish} from './model';

interface IEmployeeAccess {
    HasEmployee(id: string): Promise<boolean>;
    GetEmployeeDbId(corporate_id: string): Promise<string | null>;
    GetEmployee(id: string): Promise<Employee>;
    GetAllEmployees(): Promise<Employee[]>;
    AddEmployee(employee: Employee): Promise<string>;
    UpdateEmployee(employee: Employee, id: string): Promise<void>;
    DeleteEmployee(id: string): Promise<void>;
}

interface IRestaurantAccess {
    HasRestaurant(id: string): Promise<boolean>;
    GetRestaurant(id: string): Promise<Restaurant>;
    GetAllRestaurants(): Promise<Restaurant[]>;
    AddRestaurant(restaurant: Restaurant): Promise<string>;
    UpdateRestaurant(restaurant: Restaurant, id: string): Promise<void>;
    DeleteRestaurant(id: string): Promise<void>;
}

interface IReservationAccess {
    HasReservation(id:string): Promise<boolean>;
    GetReservation(id:string): Promise<Reservation | undefined>;
    GetAllReservations(): Promise<Reservation[]>;
    AddReservation(reservation:Reservation): Promise<string>;
    UpdateReservation(Reservation:Reservation, id:string): Promise<void>;
    DeleteReservation(id:string): Promise<void>;
}

interface ITableAccess {
    HasTable(id:string): Promise<boolean>;
    GetTable(id:string): Promise<Table | undefined>;
    GetAllTables(): Promise<Table[]>;
    AddTable(Table:Table): Promise<string>;
    UpdateTable(Table:Table, id:string): Promise<void>;
    DeleteTable(id:string): Promise<void>;
    FindFreeTable(): Promise<Table | undefined>;
    //RaportTables(): Promise<Table[]>;
}

interface IOrderAccess {
    HasOrder(order_id:string): Promise<boolean>;
    GetOrder(order_id:string): Promise<Order | undefined>;
    GetAllOrders(): Promise<Order[]>;
    GetOrdersForTable(table_name: string): Promise<Order[]>;
    GetOrdersTakenByEmployee(employee_id: string): Promise<Order[]>;
    AddOrder(order:Order): Promise<string>;
    UpdateOrder(order_id:string, order:Order): Promise<void>;
    DeleteOrder(order_id:string): Promise<void>;
    //RaportOrders(): Promise<Order[]>;
}

interface IProductAccess {
    HasProduct(id:string): Promise<boolean>;
    GetProduct(id:string): Promise<Product | undefined>;
    GetAllProducts(): Promise<Product[]>;
    AddProduct(Product:Product): Promise<string>;
    UpdateProduct(Product:Product, id:string): Promise<void>;
    DeleteProduct(id:string): Promise<void>;
}

interface IDishAccess {
    HasDish(id:string): Promise<boolean>;
    GetDish(id:string): Promise<Dish>;
    GetAllDishes(): Promise<Dish[]>;
    AddDish(dish:Dish): Promise<string>;
    UpdateDish(Dish:Dish, id:string): Promise<void>;
    DeleteDish(id:string): Promise<void>;
}

export { IEmployeeAccess, IRestaurantAccess, IReservationAccess, 
    ITableAccess, IOrderAccess, IProductAccess, IDishAccess };
