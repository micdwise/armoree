import { error } from 'console';
import pool from '../../db';
import { Request, Response } from 'express';

function getAmmunition (req: Request,res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.query("SELECT * FROM ammunition", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

function createAmmunition (req: Request,res: Response) {
  pool.query({
    text: 'INSERT INTO ammunition (manufacturer, brand, purchase_date, caliber, lot_number, qty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [
      req.body.manufacturer,
      req.body.brand, 
      req.body.purchase_hdate, 
      req.body.caliber, 
      req.body.lot_number, 
      req.body.qty]
    }), (error, results) => {
      if (error) throw error;
      return res.status(200).json(results);
      };
};

export { getAmmunition, createAmmunition };