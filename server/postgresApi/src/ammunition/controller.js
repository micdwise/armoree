const { error } = require('console');
const pool = require('../../db');

const getAmmunition = (req,res) => {
  pool.query("SELECT * FROM ammunition", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
    getAmmunition,
};