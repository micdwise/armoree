const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get("/", controller.getAmmunition);
router.post("/", controller.putAmmunition);

module.exports = router;