import fs, { existsSync, glob } from "fs";
import sharp from "sharp";
import { globbySync } from "globby";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import { ATLAS_WIDTH, JOKER_HEIGHT, JOKER_WIDTH } from "./src/util/constants.ts";
if (fs.existsSync(new URL("build", import.meta.url))) fs.rmSync(new URL("build", import.meta.url), { recursive: true });
fs.cpSync(new URL("dist", import.meta.url), new URL("build", import.meta.url), { recursive: true });
fs.cpSync(new URL("resources", import.meta.url), new URL("build", import.meta.url), { recursive: true });
if (!fs.existsSync(new URL("build/assets/1x", import.meta.url))) fs.mkdirSync(new URL("build/assets/1x", import.meta.url));
if (!fs.existsSync(new URL("build/assets/2x", import.meta.url))) fs.mkdirSync(new URL("build/assets/2x", import.meta.url));

const jokerAtlases = fs.readdirSync(new URL("jokers", import.meta.url));

fs.mkdirSync(new URL(`build/assets/2x/jokers/`, import.meta.url), { recursive: true });

for (const atlas of jokerAtlases) {
	const jokers = fs.readdirSync(new URL(`jokers/${atlas}`, import.meta.url)).map(x => {
		const matched = x.match(/(\d)+_(.+)\.png/);
		return { index: +matched![1], filename: x };
	});
	let image = sharp({
		create: {
			width: JOKER_WIDTH * ATLAS_WIDTH * 2,
			height: JOKER_HEIGHT * Math.ceil(jokers.length / ATLAS_WIDTH) * 2,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	});
	let toCompose: { input: Buffer, left: number, top: number }[] = []
	for (const joker of jokers.sort((a, b) => a.index - b.index)) {
		const img = sharp(fileURLToPath(new URL(`jokers/${atlas}/${joker.filename}`, import.meta.url)));
		const meta = await img.metadata();
		if (meta.width === JOKER_WIDTH) img.resize(meta.width! * 2, meta.height! * 2, { kernel: "nearest" });
		toCompose.push(
			{
				input: await img.toBuffer(),
				left: (joker.index % ATLAS_WIDTH) * JOKER_WIDTH * 2,
				top: Math.floor(joker.index / ATLAS_WIDTH) * JOKER_HEIGHT * 2,
			}
		);
	}

	await image.composite(toCompose).toFile(fileURLToPath(new URL(`build/assets/2x/jokers/${atlas}.png`, import.meta.url)));
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
	fs.writeFileSync(
		file,
		content.replace(/require\("(.+?)"\)/g, (_, a) => `assert(SMODS.load_file("${a.replaceAll(".", "/")}.lua"))()`)
	);
}
