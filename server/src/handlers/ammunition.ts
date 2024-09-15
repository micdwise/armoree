import { error } from 'console';
import pool from '../db';
import { Request, Response } from 'express';

function getAmmunition (req: Request,res: Response) {
  console.log("GET fired");
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.query("SELECT *, TO_CHAR(purchase_date, 'dd-mm-yyy') FROM ammunition", (error: any, results: any) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

function createAmmunition (req: Request,res: Response, next: any) {
  try {
    console.log("POST fired");
    console.log(req.body);
    pool.query({
      text: 'INSERT INTO ammunition (manufacturer, brand, purchase_date, caliber, lot_number, qty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [
        req.body.manufacturer,
        req.body.brand, 
        req.body.purchase_date, 
        req.body.caliber, 
        req.body.lot_number, 
        req.body.qty]
      });
  } catch (err: any) {
      console.error(err.message);
    }
    next();
};

export { getAmmunition, createAmmunition };