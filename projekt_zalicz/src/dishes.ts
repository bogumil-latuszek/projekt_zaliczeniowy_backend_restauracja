import express from 'express';
import {Request, Response} from 'express';
import {IDishAccess} from "idata_access"
import {getDishesAccess} from 'data_access_selector'
import {Dish} from 'model';

const  router = express.Router()
export default router

let db_dish: IDishAccess = getDishesAccess();

router.get('/', async (req: Request, res: Response) => {

    let all_dishes: Dish[] = await db_dish.GetAllDishes();
    res.status(200).send(all_dishes);
})

router.post('/', async(req:Request, res: Response) =>{
   let dish: Dish = req.body
   let newly_added_id = db_dish.AddDish(dish);
   return Promise.resolve(newly_added_id);
})

//router.put()

//router.delete()