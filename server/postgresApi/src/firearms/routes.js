const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get("/", controller.getFirearms);
router.post("/", controller.postFirearms);

module.exports = router;