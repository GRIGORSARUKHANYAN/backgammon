const express = require("express");
const diceRouter = require("./routes/dice-router");
const util = require("./util");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", diceRouter);

// console.log(util.dice());

// app.get("/",(req,res) =>{
//     res.send({
//         name:"JOHN"
//     });
// })

app.listen(3000);
