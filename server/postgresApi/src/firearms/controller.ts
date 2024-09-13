import { error } from 'console';
import pool from '../../db';
import { Request, Response } from 'express';

function getFirearms (req: Request,res: Response) {
  res.send("getFirearms is working!")
};

function postFirearms (req: Request,res: Response) {
  res.send("postFirearms is working! Yay!")
};

export { getFirearms, postFirearms};