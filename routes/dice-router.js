const express = require('express');
const router = express.Router();
const diceController =  require("../controllers/dice-controller")

router.post('/', function(req, res){
    return diceController.diceStep(req,res);
});


router.get('/throw', function(req, res){
    res.send(diceController.dice(req,res));
});

module.exports = router;