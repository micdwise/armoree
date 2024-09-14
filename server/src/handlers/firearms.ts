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
  res.send("postFirearms is working! Yay!")
};

export { getFirearms, createFirearms};