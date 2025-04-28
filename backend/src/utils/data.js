import fs from "fs"
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "masterPrograms.json");
const fileContent = fs.readFileSync(filePath, "utf-8");
export const masterPrograms =JSON.parse(fileContent);