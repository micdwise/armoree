import pool from "../db";
import { Request, Response } from "express";

function getAmmunition(req: Request, res: Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  pool.query("SELECT * FROM ammunition", (error: any, results: any) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
}

function createAmmunition(req: Request, res: Response) {
  console.log(req.body);
  pool.query(
    "INSERT INTO ammunition (manufacturer, brand, purchase_date, caliber, lot_number, qty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      req.body.manufacturer,
      req.body.brand,
      req.body.purchase_date,
      req.body.caliber,
      req.body.lot_number,
      req.body.qty,
    ],
    (error: any, results: any) => {
      if (error) {
        throw error;
      }
      res.status(201).send("Successfully added Ammunition!");
    }
  );
}

function deleteAmmunition(req: Request, res: Response) {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).send("Invalid ID Supplied");
  }

  pool.query("DELETE FROM ammunition WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(204).send();
  });
}

function getAmmunitionSummary(req: Request, res: Response) {
  pool.query(
    "SELECT caliber, SUM(qty) as total_rounds FROM ammunition GROUP BY caliber",
    (error: any, results: any) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

export {
  getAmmunition,
  createAmmunition,
  deleteAmmunition,
  getAmmunitionSummary,
};
