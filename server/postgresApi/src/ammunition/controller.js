const { error } = require('console');
const pool = require('../../db');

const getAmmunition = (req,res) => {
  pool.query("SELECT * FROM ammo", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const putAmmunition = (req,res) => {
  res.send("POST is working! Yay!")
};

module.exports = {
    getAmmunition,
    putAmmunition,
};