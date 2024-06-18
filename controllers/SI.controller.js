
require("dotenv").config();
const express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
const fs = require("fs");
const { text, json } = require("body-parser");
let correctAnswer;
let Tip;
router.get("/objectLabelsSI", async (req, res) => {
    const labels = [
      { paragraph: "text" },
      { _Object_: "text" },
   

    ];
 
    res.status(200).json(
        labels, 
     
    )
});

router.post("/saveObjectSI/:id", async (req, res) => {
  const id = req.params.id
  const { objectElements } = req.body
  const newObj = {}
  
  newObj.type = "SI"
  const parameters = { slides: [] }
  for (let item of objectElements) {
      let key = Object.keys(item)[0]
      if (key === "paragraph") {
        parameters.slides.push({paragraph:item[key]})
    
      } else if (key === "_Object_") {
        parameters.slides[parameters.slides.length - 1]["_Object_"] = item[key]

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