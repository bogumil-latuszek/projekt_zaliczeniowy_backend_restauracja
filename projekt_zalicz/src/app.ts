import express from 'express';
import {Request, Response} from 'express';
import { initDataAccess, dropDataAccess } from 'data_access_selector'

import reservations_router from 'reservations'; //1st endpoint import
import dishes_router from 'dishes';
import products_router from 'products';
import restaurants_router from 'restaurants';
import employees_router from 'employees';
import tables_router from 'tables';
import orders_router from 'orders';

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Witamy w naszej restauracji')
})


app.use('/reservations/', reservations_router) //1st endpoint registration
app.use('/dishes/', dishes_router)
app.use('/products/', products_router)
app.use('/restaurants/', restaurants_router)
app.use('/employees/', employees_router)
app.use('/tables/', tables_router)
app.use('/orders/', orders_router)

const cleanUp = (eventType) => {
    dropDataAccess();
};
  
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, cleanUp.bind(null, eventType));
})

const start = async () => {
    try {
        await initDataAccess();
        app.listen(3000, () => console.log("Server started on port 3000"));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
