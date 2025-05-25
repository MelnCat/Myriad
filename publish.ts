import fs, { existsSync, glob } from "fs";
import sharp from "sharp";
import { globbySync } from "globby";
import { fileURLToPath, pathToFileURL } from "url";
import path, { basename, dirname } from "path";
import { ATLAS_WIDTH, JOKER_HEIGHT, JOKER_WIDTH } from "./src/util/constants.ts";
if (fs.existsSync(new URL("build", import.meta.url))) fs.rmSync(new URL("build", import.meta.url), { recursive: true });
fs.cpSync(new URL("dist", import.meta.url), new URL("build", import.meta.url), { recursive: true });
fs.cpSync(new URL("resources", import.meta.url), new URL("build", import.meta.url), { recursive: true });
if (!fs.existsSync(new URL("build/assets/1x", import.meta.url))) fs.mkdirSync(new URL("build/assets/1x", import.meta.url));
if (!fs.existsSync(new URL("build/assets/2x", import.meta.url))) fs.mkdirSync(new URL("build/assets/2x", import.meta.url));

let atlases: Record<string, Record<string, Record<string, { x: number; y: number }>>> = {};

const allAtlases = fs.readdirSync(new URL("atlas", import.meta.url));
for (const atlas of allAtlases) {
	atlases[atlas] = {};
	for (const subAtlas of fs.readdirSync(new URL(`atlas/${atlas}`, import.meta.url))) {
		atlases[atlas][subAtlas] = {};
		fs.mkdirSync(new URL(`build/assets/1x/${atlas}/`, import.meta.url), { recursive: true });
		fs.mkdirSync(new URL(`build/assets/2x/${atlas}/`, import.meta.url), { recursive: true });
		const items = fs.readdirSync(new URL(`atlas/${atlas}/${subAtlas}`, import.meta.url));
		let image = sharp({
			create: {
				width: JOKER_WIDTH * ATLAS_WIDTH * 2,
				height: JOKER_HEIGHT * Math.ceil(items.length / ATLAS_WIDTH) * 2,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			},
		});
		let toCompose: { input: Buffer; left: number; top: number }[] = [];
		for (const [i, joker] of items.sort((a, b) => a.localeCompare(b)).entries()) {
			atlases[atlas][subAtlas][path.parse(joker).name] = { x: i % ATLAS_WIDTH, y: Math.floor(i / ATLAS_WIDTH) };
			const img = sharp(fileURLToPath(new URL(`atlas/${atlas}/${subAtlas}/${joker}`, import.meta.url)));
			const meta = await img.metadata();
			if (meta.width === JOKER_WIDTH) img.resize(meta.width! * 2, meta.height! * 2, { kernel: "nearest" });
			toCompose.push({
				input: await img.toBuffer(),
				left: (i % ATLAS_WIDTH) * JOKER_WIDTH * 2,
				top: Math.floor(i / ATLAS_WIDTH) * JOKER_HEIGHT * 2,
			});
		}

		await image.composite(toCompose).toFile(fileURLToPath(new URL(`build/assets/2x/${atlas}/${subAtlas}.png`, import.meta.url)));
	}
}

const atlases2x = globbySync(fileURLToPath(new URL("build/assets/2x/**/*.png", import.meta.url)).replaceAll("\\", "/"));
for (const atlas of atlases2x) {
	if (existsSync(atlas.replace("2x", "1x"))) continue;
	const image = sharp(atlas);
	const meta = await image.metadata();
	fs.mkdirSync(dirname(atlas.replace("2x", "1x")), { recursive: true });
	await image.resize(meta.width! / 2, meta.height! / 2, { kernel: "nearest" }).toFile(atlas.replace("2x", "1x"));
}

const atlases1x = globbySync(fileURLToPath(new URL("build/assets/1x/**/*.png", import.meta.url)).replaceAll("\\", "/"));

for (const atlas of atlases1x) {
	if (existsSync(atlas.replace("1x", "2x"))) continue;
	const image = sharp(atlas);
	const meta = await image.metadata();
	fs.mkdirSync(dirname(atlas.replace("1x", "2x")), { recursive: true });
	await image
		.resize(meta.width! * 2, meta.height! * 2, { kernel: "nearest" })
		.png()
		.toFile(atlas.replace("1x", "2x").replace("resources", "build"));
}

const luaFiles = globbySync(fileURLToPath(new URL("build/**/*.lua", import.meta.url)).replaceAll("\\", "/"));

for (const file of luaFiles) {
	const content = fs.readFileSync(file, { encoding: "utf8" });
	const replaced = (() => {
		let str = content;
		str = str.replace(/require\("(.+?)"\)/g, (_, a) =>
			["ffi", "SMODS.https"].includes(a) ? _ : `MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.require("${a.replaceAll(".", "/")}.lua")`
		);
		if (file.endsWith("atlas.lua")) str = str.replace(`"<data>"`, JSON.stringify(JSON.stringify(atlases)));
		return str;
	})();

	fs.writeFileSync(
		file,
		basename(file) === "index.lua"
			? /* lua */ `\
local MYRIAD_FILEMAP = {}
_G.MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED = {}
_G.MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.hideNumbers = false
_G.MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.require = function(name)
    if MYRIAD_FILEMAP[name] ~= nil then
        return MYRIAD_FILEMAP[name]
    end
    MYRIAD_FILEMAP[name] = assert(SMODS.load_file(name))(nil)
	return MYRIAD_FILEMAP[name]
end
${replaced}`
			: replaced
	);
}

console.log("ok");
