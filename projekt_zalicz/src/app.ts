import express from 'express';
import {Request, Response} from 'express';
import { initDataAccess, dropDataAccess } from 'data_access_selector'

import reservations_router from 'reservations';

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Witamy w naszej restauracji')
})

app.use('/reservations/', reservations_router)

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
