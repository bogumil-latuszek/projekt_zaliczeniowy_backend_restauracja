import express from 'express';
import {Request, Response} from 'express';
import {IEmployeeAccess} from "idata_access"
import {getEmployeeAccess} from 'data_access_selector'
import {Employee} from 'model';

const  router = express.Router()
export default router

let db_employee: IEmployeeAccess = getEmployeeAccess();

router.get('/', async (req: Request, res: Response) => {
    let all_employees: Employee[] = await db_employee.GetAllEmployees();
    res.status(200).send(all_employees);
})

router.get('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_employee.HasEmployee(id)
    if (!exists) {
        res.status(404).send(`employee with id=${id} doesn't exist`)
    }
    else {
        let employee: Employee = await db_employee.GetEmployee(id);
        res.status(200).send(employee)
    }
})

router.post('/', async(req:Request, res: Response) => {
    let employee: Employee = req.body;
    const corporate_id = employee.CorporateID;
    const db_id = await db_employee.GetEmployeeDbId(corporate_id);
    if (db_id) {
        let existing_employee: Employee = await db_employee.GetEmployee(db_id);
        res.status(400).send({
            error: `CorporateID=${corporate_id} already taken by ${existing_employee.Name} ${existing_employee.Surename}`
        });
    }
    else {
        let newly_added_id = await db_employee.AddEmployee(employee);
        res.status(201).send({id: newly_added_id, CorporateID: employee.CorporateID});
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_employee.HasEmployee(id)
    if (!exists) {
        res.status(404).send(`employee with id=${id} doesn't exist`)
    }
    else {
        let updated_employee: Employee = req.body;
        await db_employee.UpdateEmployee(updated_employee, id);
        res.status(204).send({})  // 204 - no content
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    let exists: boolean = await db_employee.HasEmployee(id)
    if (!exists) {
        res.status(404).send(`employee with id=${id} doesn't exist`)
    }
    else {
        await db_employee.DeleteEmployee(id);
        res.status(204).send({})  // 204 - no content
    }
})
