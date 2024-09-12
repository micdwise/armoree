const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get("/", controller.getAmmunition);

router.post("/", controller.postAmmunition);

module.exports = router;