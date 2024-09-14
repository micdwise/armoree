import { error } from 'console';
import pool from '../db';
import { Request, Response } from 'express';

function getFirearms (req: Request,res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.query("SELECT * FROM firearms", (error: any, results: any) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

function createFirearms (req: Request,res: Response) {
  pool.query({
    text: 'INSERT INTO firearms (manufacturer, model, purchase_date, caliber, serial_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [
      req.body.manufacturer,
      req.body.model, 
      req.body.purchase_date, 
      req.body.caliber, 
      req.body.serial_number ]
    }), (error: any, results: any) => {
      if (error) throw error;
      return res.status(200).json(results);
      };
};

export { getFirearms, createFirearms};