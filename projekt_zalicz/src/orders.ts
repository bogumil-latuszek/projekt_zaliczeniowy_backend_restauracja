import express from 'express';
import {Request, Response} from 'express';
import {IOrderAccess, IDishAccess} from "idata_access"
import {getOrdersAccess, getDishesAccess} from 'data_access_selector'
import {Dish, Order} from 'model';
import { visitFunctionBody } from 'typescript';
import { Mongo_Order } from 'mongo_models';

const  router = express.Router()
export default router

let db_order: IOrderAccess = getOrdersAccess();
let db_dish: IDishAccess = getDishesAccess();

router.get('/', async (req: Request, res: Response) => {
    let all_orderes: Order[] = await db_order.GetAllOrders();
    res.status(200).send(all_orderes);
})

router.get('/:id', async (req: Request, res: Response) => {
    let searching_id = req.params.id
    let order_exists = await db_order.HasOrder(searching_id);
    if(order_exists){
        let order: Order = await db_order.GetOrder(searching_id)
        res.status(200).send(order);
    }
    else{
        res.status(404).send(`order with id=${searching_id} doesn't exist`);
    }
})

//  interface Order{
//     TableName: string;
//     EmployeeID: string;
//     DishesNames: string[];
//     Status: string; //optional
//     Creation_date: string; //optional
//     Bill?: number; //optional
// }



router.post('/', async(req:Request, res: Response) =>{
    //first, check if given data is valid
    if (! req.body) { 
        res.status(400).send({'err': 'no data provided to create an order'})
    }
    //second, check if body contains bill
    if(req.body.Bill == null){
        let _dishes: Dish[] = await db_dish.GetDishesByNames(req.body.DishesNames);
        req.body.Bill = await db_dish.CombineDishesPrices(_dishes);
    }
    //third, create order
    try {
        var date = new Date();
        let current_date = date.getUTCDate.toString();
        let order: Order = {
            TableName: req.body.TableName,
            EmployeeID: req.body.EmployeeID,
            DishesNames: req.body.DishesNames,
            Status: "złożone",
            Creation_date: current_date,
            Bill: req.body.Bill
        }
        let newly_added_id = await db_order.AddOrder(order);
        res.status(201).send({'id': newly_added_id});
    }
    catch(err){
         res.status(500).send(`error: ${err.message}`);
     }
})

router.put('/:id', async(req:Request, res: Response) =>{
    try{
        let searching_id = req.params.id
        let order: Order = req.body //maybe creation date shouldnt be changed?
        let newly_added_id = await db_order.UpdateOrder(searching_id, order);
    }
    catch(err){
        res.status(400).send(`error: ${err}`);
    }
    res.status(204).send({})  // 204 - no content
 })

 router.delete('/:id', async(req:Request, res: Response) =>{
    let searching_id = req.params.id
    let order_exists = await db_order.HasOrder(searching_id);
    if(order_exists){
        await db_order.DeleteOrder(searching_id);
        res.status(204).send({})  // 204 - no content
    }
    else{
        res.status(404).send(`order with id=${searching_id} doesn't exist`);
    }
 })