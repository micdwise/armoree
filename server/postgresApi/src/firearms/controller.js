const { error } = require('console');
const pool = require('../../db');

const getFirearms= (req,res) => {
  res.send("getFirearms is working!")
};

const postFirearms = (req,res) => {
  res.send("postFirearms is working! Yay!")
};

module.exports = {
    getFirearms,
    postFirearms,
};