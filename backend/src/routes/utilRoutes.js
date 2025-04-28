import express from "express";
import { masterPrograms } from "../utils/data.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const router = express.Router();

router.get("/get/trainings", (req, res) => {
  try {
    res.status(200).json({ masterPrograms });
  } catch (error) {
    console.log(error);

    res.json({
      message: error.message,
    });
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up one folder (from routes to src) then into utils
const filePath = path.join(__dirname, "../utils/masterPrograms.json");


router.put("/update/trainings", (req, res) => {
  try {
    const { program } = req.body;
    console.log("Request for New Training");

    console.log("Program ", req.body);
    if (
      !program ||
      typeof program.training !== "string" ||
      !Array.isArray(program.modules)
    ) {
      return res.status(400).json({ message: "Invalid program format" });
    }
    const rawData = fs.readFileSync(filePath);
    const masterPrograms = JSON.parse(rawData);
    const exists = masterPrograms.some((p) => p.training === program.training);

    if (exists) {
      return res.status(409).json({ message: "Program already exists" });
    }

    masterPrograms.push(program);

    fs.writeFileSync(filePath, JSON.stringify(masterPrograms, null, 2));

    res.json({ message: "Updated Successfully" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });

  }
});

export default router;
