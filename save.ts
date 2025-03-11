import os from "os";
import path from "path";
import fs from "fs";

const home = os.homedir();
const balatroMods = path.join(home, `AppData/Roaming/Balatro/Mods`);
if (!fs.existsSync(balatroMods)) throw new Error("No balatro mods folder found.");
const modFolder = path.join(balatroMods, "Myriad");
if (fs.existsSync(modFolder)) fs.rmSync(modFolder, { recursive: true });
fs.cpSync(new URL("build", import.meta.url), modFolder, { recursive: true });
