import express from 'express';
import {Request, Response} from 'express';
import {ITableAccess} from "idata_access"
import {getTablesAccess} from 'data_access_selector'
import {Table} from 'model';

const  router = express.Router()
export default router

let db_table: ITableAccess = getTablesAccess();
//Wyszukiwarka wolnego stolika w danym dniu dla wskazanej ilości osób.
// router.get('/free', async (req: Request, res: Response) => {
//     let all_tables: Table[] = await db_table.GetFreeTables();
//     res.status(200).send(all_tables);
// })

router.get('/', async (req: Request, res: Response) => {
    let all_tables: Table[] = await db_table.GetAllTables();
    res.status(200).send(all_tables);
})

router.get('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_table.HasTable(id)
    if (!exists) {
        res.status(404).send(`table with id=${id} doesn't exist`)
    }
    else {
        let table: Table = await db_table.GetTable(id);
        res.status(200).send(table)
    }
})

router.post('/', async(req:Request, res: Response) => {
   let table: Table = req.body
   let newly_added_id = await db_table.AddTable(table);
   res.status(201).send({'id': newly_added_id});
})

router.put('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_table.HasTable(id)
    if (!exists) {
        res.status(404).send(`table with id=${id} doesn't exist`)
    }
    else {
        let updated_table: Table = req.body;
        await db_table.UpdateTable(updated_table, id);
        res.status(204).send({})  // 204 - no content
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_table.HasTable(id)
    if (!exists) {
        res.status(404).send(`table with id=${id} doesn't exist`)
    }
    else {
        await db_table.DeleteTable(id);
        res.status(204).send({})  // 204 - no content
    }
})
