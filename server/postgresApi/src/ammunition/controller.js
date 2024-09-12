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
  res.send("POST is working! Yay!")
};

module.exports = {
    getAmmunition,
    postAmmunition,
};