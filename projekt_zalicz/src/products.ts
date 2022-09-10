import express from 'express';
import {Request, Response} from 'express';
import {IProductAccess} from "idata_access"
import {getProductsAccess} from 'data_access_selector'
import {Product} from 'model';

const  router = express.Router()
export default router

let db_product: IProductAccess = getProductsAccess();

router.get('/', async (req: Request, res: Response) => {
    let all_products: Product[] = await db_product.GetAllProducts();
    res.status(200).send(all_products);
})

router.get('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_product.HasProduct(id)
    if (!exists) {
        res.status(404).send(`product with id=${id} doesn't exist`)
    }
    else {
        let product: Product = await db_product.GetProduct(id);
        res.status(200).send(product)
    }
})

router.post('/', async(req:Request, res: Response) => {
   let product: Product = req.body
   let newly_added_id = await db_product.AddProduct(product);
   res.status(201).send({'id': newly_added_id});
})

router.put('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_product.HasProduct(id)
    if (!exists) {
        res.status(404).send(`product with id=${id} doesn't exist`)
    }
    else {
        let updated_product: Product = req.body;
        await db_product.UpdateProduct(updated_product, id);
        res.status(204).send({})  // 204 - no content
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_product.HasProduct(id)
    if (!exists) {
        res.status(404).send(`product with id=${id} doesn't exist`)
    }
    else {
        await db_product.DeleteProduct(id);
        res.status(204).send({})  // 204 - no content
    }
})
//paginacja i sortowanie
router.get('/', async (req: Request, res: Response) => { 
    // mozliwe query: /products/?limit=10&offset=30&sort=nazwa
    let limit: number = +req.query.limit;
    let offset: number = +req.query.offset;
    let sort_by: string = req.query.sort_by as string;
    const provided_query_keys: string[] = Object.keys(req.query)

    let all_products: Product[];
    if (provided_query_keys.length) {
        if (sort_by) {
            all_products = await db_product.GetSelectedProducts(sort_by, offset, limit);
            res.status(200).send(all_products);
        }
        else {
            const err = "Product query is missing required 'sort_by' key";
            const allowed = "(allowed: sort_by, offset, limit)";
            res.status(400).send(`${err}. You have provided: '${provided_query_keys}'. ${allowed}`);
        }
    }
    else {
        all_products = await db_product.GetAllProducts();
        res.status(200).send(all_products);
    }
})
