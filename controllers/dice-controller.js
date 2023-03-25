let field = [
  { size: 5, color: "white" },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 5, color: "black" },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
  { size: 0, color: null },
];
let lastPositionObj = { white: 0, black: 0 };
let lastDice = "black";
let dices = null;

function invertedField(fieldCopy) {
  let arrCopy = JSON.parse(JSON.stringify(fieldCopy));
  for (let i = fieldCopy.length - 1; i > fieldCopy.length / 2 - 1; i--) {
    arrCopy.unshift(fieldCopy[i]);
  }
  arrCopy.length = 24;
  return arrCopy;
}

function validator(params) {
  if (!params) {
    return "request body is missing";
  }
  if (!params.color || !(params.color == "white" || params.color == "black")) {
    return "in the settings color is missing";
  }
  if (
    params.from1 &&
    (typeof params.from1 !== "number" || params.from1 > 23 || params.from1 < 0)
  ) {
    return "from1 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.to1 &&
    (typeof params.to1 !== "number" || params.to1 > 24 || params.to1 < 0)
  ) {
    return "to1 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.from2 &&
    (typeof params.from2 !== "number" || params.from2 > 23 || params.from2 < 0)
  ) {
    return "from2 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.to2 &&
    (typeof params.to2 !== "number" || params.to2 > 24 || params.to2 < 0)
  ) {
    return "to2 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.from3 &&
    (typeof params.from3 !== "number" || params.from3 > 23 || params.from3 < 0)
  ) {
    return "from3 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.to3 &&
    (typeof params.to3 !== "number" || params.to3 > 24 || params.to3 < 0)
  ) {
    return "to3 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.from4 &&
    (typeof params.from4 !== "number" || params.from4 > 23 || params.from3 < 0)
  ) {
    return "from4 does not satisfy the condition Enter numbers in the range 0-24";
  }
  if (
    params.to4 &&
    (typeof params.to4 !== "number" || params.to4 > 24 || params.to4 < 0)
  ) {
    return "to4 does not satisfy the condition Enter numbers in the range 0-24";
  }
}

function dice() {
  let number1 = Math.floor(Math.random() * 6) + 1;
  let number2 = Math.floor(Math.random() * 6) + 1;
  dices = { dice1: number1, dice2: number2 };
  return { dice1: number1, dice2: number2 };
}

function diceStep(req, res) {
  if (!dices) {
    return res.status(400).send({ message: "roll the dices", field: field });
  }
  let fieldCopy = JSON.parse(JSON.stringify(field));
  let copyLastPositionObj = JSON.parse(JSON.stringify(lastPositionObj));
  let stepfirsthome = 0;
  let stepTaken = 0;
  let params = req.body;
  let noGame = 0;
  let stepUndone = dices.dice1;
  let paramsError = validator(params);
  if (paramsError) {
    return res.status(400).send({ message: `${paramsError}`, field: field });
  }

  if (!params || !params.color) {
    return res
      .status(400)
      .send({ message: "request body not found", field: field });
  }
  if (params.color == lastDice) {
    return res
      .status(400)
      .send({ message: "it's not your turn", field: field });
  }
  if (
    (!params.from1 && params.from1 !== 0) ||
    (!params.to1 && params.to1 !== 0)
  ) {
    for (let i = 0; i < fieldCopy.length; i++) {
      if (fieldCopy[i].color == params.color) {
        let checker1 = i + dices.dice1;
        let checker2 = i + dices.dice2;
        if (checker1 < 24) {
          if (
            fieldCopy[checker1].color == null ||
            fieldCopy[checker1].color == params.color
          ) {
            noGame++;
          }
        }
        if (checker2 < 24) {
          if (
            fieldCopy[checker2].color == null ||
            fieldCopy[checker2].color == params.color
          ) {
            noGame++;
          }
        }
      }
    }
    if (noGame == 0) {
      lastDice = params.color;
      fieldCopy = invertedField(fieldCopy);
      field = JSON.parse(JSON.stringify(fieldCopy));
      lastPositionObj = JSON.parse(JSON.stringify(copyLastPositionObj));
      console.log(field, "good 1");
      return res.status(200).send({ field: field });
    }
  }

  if (
    (!params.from1 && params.from1 !== 0) ||
    (!params.to1 && params.to1 !== 0)
  ) {
    return res.status(400).send({
      message: "parameters are incomplete added from1,to1",
      field: field,
    });
  }
  if (
    fieldCopy[params.from1].color !== params.color ||
    fieldCopy[params.from1].size < 1
  ) {
    console.log("error1");
    return res
      .status(400)
      .send({ message: "you are not eligible for that move", field: field });
  }

  if (params.to1 == 24) {
    if (
      params.to1 - params.from1 > dices.dice1 &&
      params.to1 - params.from1 > dices.dice2
    ) {
      console.log("error0");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }

    if (
      fieldCopy[params.from1].size == 0 ||
      fieldCopy[params.from1].color !== params.color
    ) {
      console.log("error12");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }

    for (let i = 0; i < fieldCopy.length; i++) {
      if (fieldCopy[i].color == params.color) {
        if (i < 18) {
          return res.status(400).send({
            message:
              "you cannot remove the checker if all the checkers are not on your field yet",
            field: field,
          });
        }
      }
    }

    if (
      params.to1 - params.from1 == dices.dice1 ||
      params.to1 - params.from1 == dices.dice2
    ) {
      let stepTaken = params.to1 - params.from1;
      stepUndone = dices.dice1 + dices.dice2 - stepTaken;
      fieldCopy[params.from1].size = fieldCopy[params.from1].size - 1;
      copyLastPositionObj[params.color]++;
      if (fieldCopy[params.from1].size == 0) {
        fieldCopy[params.from1].color = null;
      }
    } else {
      for (let i = 18; i < params.from1; i++) {
        if (fieldCopy[i].color == params.color) {
          return res.status(400).send({
            message: "you are not eligible for that move",
            field: field,
          });
        }
      }
      let stepTaken = params.to1 - params.from1;
      if (stepTaken > Math.min(dices.dice1, dices.dice2)) {
        stepUndone = Math.max(dices.dice1, dices.dice2);
      } else {
        stepUndone = Math.min(dices.dice1, dices.dice2);
      }
      fieldCopy[params.from1].size = fieldCopy[params.from1].size - 1;
      copyLastPositionObj[params.color]++;
      if (fieldCopy[params.from1].size == 0) {
        fieldCopy[params.from1].color = null;
      }
    }
    if (copyLastPositionObj[params.color] == 5) {
      console.log("good 2");
      return res.status(200).send({ message: `You win ${params.color}` });
    }
  } else {
    if (
      fieldCopy[params.to1].color !== params.color &&
      fieldCopy[params.to1].color !== null
    ) {
      return res.status(400).send({
        message: "there is no right to take such a step",
        field: field,
      });
    }
    if (
      !(params.to1 - params.from1 == dices.dice1) &&
      !(params.to1 - params.from1 == dices.dice2)
    ) {
      console.log("error2");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }
    if (fieldCopy[params.from1].size == 0) {
      console.log("error3");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }
    if (params.from1 == 0) {
      stepfirsthome++;
    }

    stepTaken = params.to1 - params.from1;
    stepUndone = dices.dice1 + dices.dice2 - stepTaken;
    fieldCopy[params.from1].size = fieldCopy[params.from1].size - 1;
    fieldCopy[params.to1].size = fieldCopy[params.to1].size + 1;
    fieldCopy[params.to1].color = params.color;
    if (fieldCopy[params.from1].size == 0) {
      fieldCopy[params.from1].color = null;
    }
  }

  if ((!params.from2 && params.from2 !== 0) || !params.to2) {
    let noStep = 0;
    for (let i = 0; i < fieldCopy.length; i++) {
      if (fieldCopy[i].color == params.color) {
        let stepValidator = i + stepUndone;
        if (stepValidator < 24) {
          if (
            fieldCopy[stepValidator].color == null ||
            fieldCopy[stepValidator].color == params.color
          ) {
            noStep++;
          }
        }
      }
    }
    if (noStep > 0) {
      return res.status(400).send({
        message: "parameters are incomplete added from2,to2",
        field: field,
      });
    }
    lastDice = params.color;
    fieldCopy = invertedField(fieldCopy);
    field = JSON.parse(JSON.stringify(fieldCopy));
    lastPositionObj = JSON.parse(JSON.stringify(copyLastPositionObj));
    console.log(field, "good 3");
    return res.status(200).send({ field: field });
  }
  if (
    fieldCopy[params.from2].color !== params.color ||
    fieldCopy[params.from2].size < 1
  ) {
    console.log("error123");
    return res
      .status(400)
      .send({ message: "you are not eligible for that move", field: field });
  }

  if (params.to2 == 24) {
    if (stepUndone < params.to2 - params.from2) {
      console.log("error0");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }

    if (
      fieldCopy[params.from2].size < 1 ||
      fieldCopy[params.from2].color !== params.color
    ) {
      console.log("error12");
      // return "error"
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }
    for (let i = 0; i < fieldCopy.length; i++) {
      if (fieldCopy[i].color == params.color) {
        if (i < 18) {
          // return "error"
          return res.status(400).send({
            message:
              "you cannot remove the checker if all the checkers are not on your field yet",
            field: field,
          });
        }
      }
    }

    if (params.to2 - params.from2 == stepUndone) {
      fieldCopy[params.from2].size = fieldCopy[params.from2].size - 1;
      copyLastPositionObj[params.color]++;
      if (fieldCopy[params.from2].size == 0) {
        fieldCopy[params.from2].color = null;
      }
    } else {
      for (let i = 18; i < params.from2; i++) {
        if (fieldCopy[i].color == params.color) {
          return res.status(400).send({
            message: "you are not eligible for that move",
            field: field,
          });
        }
      }
      fieldCopy[params.from2].size = fieldCopy[params.from2].size - 1;
      copyLastPositionObj[params.color]++;
      if (fieldCopy[params.from2].size == 0) {
        fieldCopy[params.from2].color = null;
      }
    }
    if (copyLastPositionObj[params.color] == 5) {
      ("good 4");
      return res.status(200).send({ message: `You win ${params.color}` });
    }
  } else {
    if (
      fieldCopy[params.to2].color !== params.color &&
      fieldCopy[params.to2].color !== null
    ) {
      return res.status(400).send({
        message: "there is no right to take such a step",
        field: field,
      });
    }
    {
      if (params.to2 - params.from2 !== stepUndone) {
        return res.status(400).send({
          message: "there is no right to take such a step",
          field: field,
        });
      }

      if (stepfirsthome > 0 && params.from2 == 0) {
        return res.status(400).send({
          message: "you can move from the first square once",
          field: field,
        });
      }
      if (params.from2 == 0) {
        stepfirsthome++;
      }

      fieldCopy[params.from2].size = fieldCopy[params.from2].size - 1;
      fieldCopy[params.to2].size = fieldCopy[params.to2].size + 1;
      fieldCopy[params.to2].color = params.color;
      if (fieldCopy[params.from2].size == 0) {
        fieldCopy[params.from2].color = null;
      }
    }
  }

  if (dices.dice1 == dices.dice2) {
    if ((!params.from3 && params.from3 !== 0) || !params.to3) {
      let noStep = 0;
      let i = 0;
      if (stepfirsthome > 0) {
        i = 1;
      }
      for (; i < fieldCopy.length; i++) {
        if (fieldCopy[i].color == params.color) {
          let stepValidator = i + dices.dice1;
          if (stepValidator < 24) {
            if (
              fieldCopy[stepValidator].color == null ||
              fieldCopy[stepValidator].color == params.color
            ) {
              noStep++;
            }
          }
        }
      }
      if (noStep !== 0) {
        return res
          .status(400)
          .send({
            message: "parameters are incomplete added from3,to3",
            field: field,
          });
      }
      lastDice = params.color;
      fieldCopy = invertedField(fieldCopy);
      field = JSON.parse(JSON.stringify(fieldCopy));
      lastPositionObj = JSON.parse(JSON.stringify(copyLastPositionObj));
      console.log(field, "good 5");
      return res.status(200).send({ field: field });
    }
    if (
      fieldCopy[params.from3].color !== params.color ||
      fieldCopy[params.from3].size < 1
    ) {
      console.log("error124");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }

    if (params.to3 == 24) {
      stepUndone = dices.dice1;

      if (stepUndone < params.to3 - params.from3) {
        console.log("error0");
        return res
          .status(400)
          .send({
            message: "you are not eligible for that move",
            field: field,
          });
      }

      if (
        fieldCopy[params.from3].size == 0 ||
        fieldCopy[params.from3].color !== params.color
      ) {
        console.log("error12");
        return res
          .status(400)
          .send({
            message: "you are not eligible for that move",
            field: field,
          });
      }
      for (let i = 0; i < fieldCopy.length; i++) {
        if (fieldCopy[i].color == params.color) {
          if (i < 18) {
            return res.status(400).send({
              message:
                "you cannot remove the checker if all the checkers are not on your field yet",
              field: field,
            });
          }
        }
      }
      if (params.to3 - params.from3 == stepUndone) {
        fieldCopy[params.from3].size = fieldCopy[params.from3].size - 1;
        copyLastPositionObj[params.color]++;
        if (fieldCopy[params.from3].size == 0) {
          fieldCopy[params.from3].color = null;
        }
      } else {
        for (let i = 18; i < params.from3; i++) {
          if (fieldCopy[i].color == params.color) {
            return res.status(400).send({
              message: "you are not eligible for that move",
              field: field,
            });
          }
        }
        fieldCopy[params.from3].size = fieldCopy[params.from3].size - 1;
        copyLastPositionObj[params.color]++;
        if (fieldCopy[params.from3].size == 0) {
          fieldCopy[params.from3].color = null;
        }
      }
      if (copyLastPositionObj[params.color] == 5) {
        console.log("good 10");
        return res.status(200).send({ message: `You win ${params.color}` });
      }
    } else {
      if (params.to3 - params.from3 !== dices.dice1) {
        return res
          .status(400)
          .send({
            message: "there is no right to take such a step",
            field: field,
          });
      }
      if (stepfirsthome > 0 && params.from3 == 0) {
        return res
          .status(400)
          .send({
            message: "you can move from the first square once",
            field: field,
          });
      }
      if (params.from3 == 0) {
        stepfirsthome++;
      }

      fieldCopy[params.from3].size = fieldCopy[params.from3].size - 1;
      fieldCopy[params.to3].size = fieldCopy[params.to3].size + 1;
      fieldCopy[params.to3].color = params.color;
      if (fieldCopy[params.from3].size == 0) {
        fieldCopy[params.from3].color = null;
      }
    }
    if ((!params.from4 && params.from4 !== 0) || !params.from4) {
      let noStep = 0;
      let i = 0;
      if (stepfirsthome > 0) {
        i = 1;
      }
      for (; i < fieldCopy.length; i++) {
        if (fieldCopy[i].color == params.color) {
          let stepValidator = i + dices.dice1;
          if (stepValidator < 24) {
            if (
              fieldCopy[stepValidator].color == null ||
              fieldCopy[stepValidator].color == params.color
            ) {
              noStep++;
            }
          }
        }
      }
      if (noStep !== 0) {
        return res
          .status(400)
          .send({
            message: "parameters are incomplete added from4,to4",
            field: field,
          });
      }
      lastDice = params.color;
      fieldCopy = invertedField(fieldCopy);
      field = JSON.parse(JSON.stringify(fieldCopy));
      lastPositionObj = JSON.parse(JSON.stringify(copyLastPositionObj));
      console.log(field, "good 7");
      return res.status(200).send({ field: field });
    }

    if (
      fieldCopy[params.from4].color !== params.color ||
      fieldCopy[params.from4].size < 1
    ) {
      console.log("error125");
      return res
        .status(400)
        .send({ message: "you are not eligible for that move", field: field });
    }
    if (params.to4 == 24) {
      stepUndone = dices.dice1;
      if (stepUndone < params.to4 - params.from4) {
        console.log("error0");
        return res
          .status(400)
          .send({
            message: "you are not eligible for that move",
            field: field,
          });
      }

      if (
        fieldCopy[params.from4].size == 0 ||
        fieldCopy[params.from4].color !== params.color
      ) {
        console.log("error12");
        return res
          .status(400)
          .send({
            message: "you are not eligible for that move",
            field: field,
          });
      }
      for (let i = 0; i < fieldCopy.length; i++) {
        if (fieldCopy[i].color == params.color) {
          if (i < 18) {
            return res.status(400).send({
              message:
                "you cannot remove the checker if all the checkers are not on your field yet",
              field: field,
            });
          }
        }
      }
      if (params.to4 - params.from4 == stepUndone) {
        fieldCopy[params.from4].size = fieldCopy[params.from4].size - 1;
        copyLastPositionObj[params.color]++;
        if (fieldCopy[params.from4].size == 0) {
          fieldCopy[params.from4].color = null;
        }
      } else {
        for (let i = 18; i < params.from4; i++) {
          if (fieldCopy[i].color == params.color) {
            return res.status(400).send({
              message: "you are not eligible for that move",
              field: field,
            });
          }
        }
        fieldCopy[params.from4].size = fieldCopy[params.from4].size - 1;
        copyLastPositionObj[params.color]++;
        if (fieldCopy[params.from4].size == 0) {
          fieldCopy[params.from4].color = null;
        }
      }
      if (copyLastPositionObj[params.color] == 5) {
        console.log("good 1");
        return res.status(200).send({ message: `You win ${params.color}` });
      }
    } else {
      if (stepfirsthome > 0 && params.from4 == 0) {
        return res
          .status(400)
          .send({
            message: "you can move from the first square once",
            field: field,
          });
      }

      fieldCopy[params.from4].size = fieldCopy[params.from4].size - 1;
      fieldCopy[params.to4].size = fieldCopy[params.to4].size + 1;
      fieldCopy[params.to4].color = params.color;
      if (fieldCopy[params.from4].size == 0) {
        fieldCopy[params.from4].color = null;
      }
    }
    lastDice = params.color;
    fieldCopy = invertedField(fieldCopy);
    field = JSON.parse(JSON.stringify(fieldCopy));
    lastPositionObj = JSON.parse(JSON.stringify(copyLastPositionObj));
    console.log(field, "good 9");
    return res.status(200).send({ field: field });
  }

  lastDice = params.color;
  fieldCopy = invertedField(fieldCopy);
  field = JSON.parse(JSON.stringify(fieldCopy));
  console.log(field, "good 15");
  return res.status(200).send({ field: field });
}

module.exports = {
  dice,
  diceStep,
};




// 1 datan chfrcnel 
// 2.zar partadir qcel
// 3.karj nardi grel.
// 4.zar gcelu pahin jamanak cuyc ta vordexiv ur karam gnam ankax qauleri qanakic 
// 5.hover cuycer talis ur karas gnas