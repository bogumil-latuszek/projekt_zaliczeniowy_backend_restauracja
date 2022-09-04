export interface Reservation {
    Table_Id : string;
    Time_Start : string;
    Time_End : string
    Client_Name : string
}

export interface Employee{
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
    Employee : {
        Name: string;
        Surename: string;
        Position: string;
    }
    Dishes : [{
        Name: string;
        Price: number;
        Category: string;
    }]
    Status: string;
    Creation_date: string;
    Bill: number; 
}

export interface Table{
    Name: string;
    Capacity: number;
    Status: string;
    Order:{
        Employee : Employee[];
        Dishes : Dish[];
        Status: string;
        Creation_date: string;
        Bill: number; 
    }
}

export interface Restaurant{
    Name: string;
    Address: string;
    Phone: number;
    nip: number;
    email: string;
    website: string;
}

export interface Product{
    Name: string;
    Price: number;
    Quantity: number;
    Measurement_Units: string;
}