import fs, { existsSync, glob } from "fs";
import sharp from "sharp";
import apng from "sharp-apng";
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
let animatedAtlases: Record<string, Record<string, Record<string, { x: number; y: number }[]>>> = {};

const allAtlases = fs.readdirSync(new URL("atlas", import.meta.url));
for (const atlas of allAtlases) {
	atlases[atlas] = {};
	for (const subAtlas of fs.readdirSync(new URL(`atlas/${atlas}`, import.meta.url))) {
		atlases[atlas][subAtlas] = {};
		fs.mkdirSync(new URL(`build/assets/1x/${atlas}/`, import.meta.url), { recursive: true });
		fs.mkdirSync(new URL(`build/assets/2x/${atlas}/`, import.meta.url), { recursive: true });
		const items = fs.readdirSync(new URL(`atlas/${atlas}/${subAtlas}`, import.meta.url));
		const sampleMeta = (await Promise.all(items.map(x => sharp(fileURLToPath(new URL(`atlas/${atlas}/${subAtlas}/${x}`, import.meta.url)))).map(x => x.metadata()))).sort(
			(a, b) => a.width! - b.width!
		)[0];
		if (!sampleMeta.width || !sampleMeta.height) throw new Error("Sample image dimensions not found");
		const atlasWidth = subAtlas === "blinds" ? 21 : ATLAS_WIDTH;
		let toCompose: { input: Buffer; left: number; top: number }[] = [];
		let ix = 0;
		for (const [i, item] of items.sort((a, b) => a.localeCompare(b)).entries()) {
			atlases[atlas][subAtlas][path.parse(item).name] = { x: ix % atlasWidth, y: Math.floor(ix / atlasWidth) };

			const anim = apng.framesFromApng(fileURLToPath(new URL(`atlas/${atlas}/${subAtlas}/${item}`, import.meta.url)), true) as apng.ImageData;
			const min = +anim.delay.reduce((l, c) => (c < l ? c : l), 100);
			const frameCount = anim.delay.map(x => Math.ceil(+x / min)).reduce((l, c) => l + c, 0);
			if (subAtlas === "blinds" && frameCount !== 21) throw new Error(`${item} is a blind but does not have 21 frames`);
			for (const [j, frame] of anim.frames!.entries()) {
				const delay = (anim.delay[j] as number) ?? min;
				const meta = await frame.metadata();
				if (meta.width === sampleMeta.width) frame.resize(meta.width! * 2, meta.height! * 2, { kernel: "nearest" });
				for (let t = 0; t < delay; t += min) {
					if (frameCount > 1) {
						animatedAtlases[atlas] ??= {};
						animatedAtlases[atlas][subAtlas] ??= {};
						animatedAtlases[atlas][subAtlas][path.parse(item).name] ??= [];
						animatedAtlases[atlas][subAtlas][path.parse(item).name].push({ x: ix % atlasWidth, y: Math.floor(ix / atlasWidth) });
					}
					toCompose.push({
						input: await frame.toFormat("png").toBuffer(),
						left: (ix % atlasWidth) * sampleMeta.width * 2,
						top: Math.floor(ix / atlasWidth) * sampleMeta.height * 2,
					});
					ix++;
				}
			}
		}

		let image = sharp({
			create: {
				width: sampleMeta.width * atlasWidth * 2,
				height: sampleMeta.height * Math.ceil(ix / atlasWidth) * 2,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			},
		});
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
		if (file.endsWith("atlas.lua"))
			str = str.replace(`"<data>"`, JSON.stringify(JSON.stringify(atlases))).replace(`"<animdata>"`, JSON.stringify(JSON.stringify(animatedAtlases)));
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
