export interface Reservation {
    TableName: string;
    Time_Start : string;
    Time_End : string
    Client_Name : string
}

export interface Employee{
    CorporateID: string;
    Name: string;
    Surename: string;
    Position: string;
}

export interface Dish{
    Name: string;
    Price: number;
    Category: string;
}

export interface Order{
    TableName: string;
    EmployeeID: string;
    DishesNames: string[];
    Status: string;
    Creation_date: string;
    Bill?: number; 
}

export interface Table{
    Name: string;
    Capacity: number;
    Status: string;
}

export interface Restaurant{
    Name: string;
    Address: string;
    Phone: string;
    nip: string;
    email: string;
    website: string;
}


export interface Product{
    Name: string;
    Price: number;
    Quantity: number;
    Measurement_Units: string;
}