import pool from "../db";
import { Request, Response } from "express";

function getFirearms(req: Request, res: Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  pool.query("SELECT * FROM firearms", (error: any, results: any) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
}

function createFirearms(req: Request, res: Response) {
  console.log(req.body);
  pool.query(
    "INSERT INTO firearms (manufacturer, model, purchase_date, caliber, serial_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      req.body.manufacturer,
      req.body.model,
      req.body.purchase_date,
      req.body.caliber,
      req.body.serial_number,
    ],
    (error: any, results: any) => {
      if (error) {
        throw error;
      }
      res.status(201).send("Successfuly added a Firearm!");
    }
  );
}

function deleteFirearm(req: Request, res: Response) {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).send("Invalid ID supplied");
  }

  pool.query("DELETE FROM firearms WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(204).send();
  });
}

export { getFirearms, createFirearms, deleteFirearm };
