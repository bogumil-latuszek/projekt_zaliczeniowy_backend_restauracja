import express from 'express';
import {Request, Response} from 'express';
import {IRestaurantAccess} from "idata_access"
import {getRestaurantAccess} from 'data_access_selector'
import {Restaurant} from 'model';

const  router = express.Router()
export default router

let db_restaurant: IRestaurantAccess = getRestaurantAccess();

router.get('/', async (req: Request, res: Response) => {
    let all_restaurants: Restaurant[] = await db_restaurant.GetAllRestaurants();
    res.status(200).send(all_restaurants);
})

router.get('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_restaurant.HasRestaurant(id)
    if (!exists) {
        res.status(404).send(`restaurant with id=${id} doesn't exist`)
    }
    else {
        let restaurant: Restaurant = await db_restaurant.GetRestaurant(id);
        res.status(200).send(restaurant)
    }
})

router.post('/', async(req:Request, res: Response) => {
    let all_restaurants: Restaurant[] = await db_restaurant.GetAllRestaurants();
    const already_exists = all_restaurants.length > 0;
    if (already_exists) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
        // The HTTP 409 Conflict response status code indicates a request conflict with the current state of the target resource.
        //
        // our confict: we allow for one restaurant only
        res.status(409).send("restaurant already exist")
    }
    else {
        let restaurant: Restaurant = req.body
        let newly_added_id = await db_restaurant.AddRestaurant(restaurant);
        res.status(201).send({'id': newly_added_id});
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_restaurant.HasRestaurant(id)
    if (!exists) {
        res.status(404).send(`restaurant with id=${id} doesn't exist`)
    }
    else {
        let updated_restaurant: Restaurant = req.body;
        await db_restaurant.UpdateRestaurant(updated_restaurant, id);
        res.status(204).send({})  // 204 - no content
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_restaurant.HasRestaurant(id)
    if (!exists) {
        res.status(404).send(`restaurant with id=${id} doesn't exist`)
    }
    else {
        await db_restaurant.DeleteRestaurant(id);
        res.status(204).send({})  // 204 - no content
    }
})
