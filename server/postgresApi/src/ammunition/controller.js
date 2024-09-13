const { error } = require('console');
const pool = require('../../db');

const getAmmunition = (req,res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.query("SELECT * FROM ammunition", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const postAmmunition = (req,res) => {
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
      return res.status(201).json(results.rows)
    };
};

module.exports = {
    getAmmunition,
    postAmmunition,
};