
require("dotenv").config();
const express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
const fs = require("fs");
const { text, json } = require("body-parser");
let correctAnswer;
let Tip;
router.get("/objectLabelsFillTheBlank", async (req, res) => {
    const labels = [
      { _Question_: "text" },
      { _Answer_: "text" },
   
      { _Tip_: "text" },
    

    ];
 
    res.status(200).json(
        labels, 
     
    )
});

router.post("/saveObjectFillTheBlank/:id", async (req, res) => {
  const id = req.params.id
  const { objectElements } = req.body
  const newObj = {}
  
  newObj.type = "FillTheBlank"
  const parameters = { questions: [] }
  for (let item of objectElements) {
      let key = Object.keys(item)[0]
      if (key === "_Question_") {
        parameters.questions.push({_Question_:item[key]})
        newObj.isAnswered = 'r'
      } else if (key === "_Answer_") {
        parameters.questions[parameters.questions.length - 1]["_Answer_"] = item[key]

          newObj.isAnswered = 'g'
      } else if (key === "_Tip_") {
          parameters.questions[parameters.questions.length - 1]["_Tip_"] = item[key]
      } 
  }
  newObj.parameters = parameters
  interactiveObjectSchema.updateOne(
  { _id: id },
  {
    $set: newObj,
  },
  { new: false, runValidators: true, returnNewDocument: true, upsert: true },
  (err, doc) => {
    if (!err) {
      res.status(200).json(newObj);
    } else {
      res.status(500).json(err);
    }
  }
);
});

module.exports = router;