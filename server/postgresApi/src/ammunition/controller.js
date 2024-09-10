const { error } = require('console');
const pool = require('../../db');

const getAmmunition = (req,res) => {
  pool.query("SELECT * FROM ammunition", (error, reesults) => {
    if (error) throw error;
    res.status(200).json(reesults.rows);
  });
};

module.exports = {
    getAmmunition,
};