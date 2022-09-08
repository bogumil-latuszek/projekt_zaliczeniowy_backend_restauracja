import express from 'express';
import {Request, Response} from 'express';
import {IDishAccess} from "idata_access"
import {getDishesAccess} from 'data_access_selector'
import {Dish} from 'model';

const  router = express.Router()
export default router

let db_dish: IDishAccess = getDishesAccess();

router.get('/dishes', async (req: Request, res: Response) => {
    let all_dishes: Dish[] = await db_dish.GetAllDishes();
    res.status(200).send(all_dishes);
})

router.get('/dish/:id', async (req: Request, res: Response) => {
    let searching_id = req.params.id
    let dish_exists = await db_dish.HasDish(searching_id);
    if(dish_exists){
        let dish: Dish = await db_dish.GetDish(searching_id)
        res.status(200).send(dish);
    }
    else{
        res.status(404).send(`dish with id=${searching_id} doesn't exist`);
    }
})

router.post('/dish', async(req:Request, res: Response) =>{
    try{
        let dish: Dish = req.body
        let newly_added_id = db_dish.AddDish(dish);
        res.status(200).send(newly_added_id);
    }
    catch(err){
        res.status(500).send(`error: ${err.message}`);
    }
    
})

router.put('/dish/:id', async(req:Request, res: Response) =>{
    try{
        let searching_id = req.params.id
        let dish: Dish = req.body
     let newly_added_id = await db_dish.UpdateDish(dish, searching_id);
    }
    catch(err){
        res.status(400).send(`error: ${err}`);
    }
    let searching_id = req.params.id
    let dish: Dish = req.body
    let newly_added_id = await db_dish.UpdateDish(dish, searching_id);
    res.status(200).send();
 })

 router.delete('/dish/:id', async(req:Request, res: Response) =>{
    let searching_id = req.params.id
    let dish_exists = await db_dish.HasDish(searching_id);
    if(dish_exists){
        await db_dish.DeleteDish(searching_id);
         res.status(200).send();
    }
    else{
        res.status(404).send(`dish with id=${searching_id} doesn't exist`);
    }
    
 })