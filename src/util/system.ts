import * as ffi from "ffi";
import * as nativefs from "../lib/nativefs";
import { debounce } from "./utils";
import * as lovely from "lovely";

export const matchOs = <T>(obj: Partial<Record<"win" | "mac" | "linux", (() => T) | T>>, fallback?: T | (() => T)): T => {
	const key = (
		{
			Windows: "win",
			OSX: "mac",
			Linux: "linux",
			POSIX: "linux", // it's close enough i swear
			BSD: "linux", // trust me fr
			Other: "linux",
		} as const
	)[jit.os];
	const returnValue = typeof obj[key] === "function" ? (obj[key] as Function)() : obj[key];
	if (!returnValue) {
		if (fallback) return typeof fallback === "function" ? (fallback as Function)() : fallback;
		throw new Error(`Not implemented: ${key}.`);
	}
	return returnValue;
};

const libraryFolders = (
	nativefs.read(
		matchOs({
			win: "C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf",
			mac: () => `${os.getenv("HOME")}/Library/Application Support/Steam/steamapps/libraryfolders.vdf`,
			linux: () => `${os.getenv("HOME")}/.steam/steam/steamapps/libraryfolders.vdf`,
		})
	)[0] as string
)
	?.split("\n")
	.filter(x => x.includes(`"path"`))
	.map(x => string.find(x, '"\t\t"(.+)"')[2] as string)
	.filter(x => x)
	.map(x => `${x}/steamapps`) ?? [];
const main = matchOs({
	win: "C:/Program Files (x86)/Steam/steamapps",
	mac: () => `${os.getenv("HOME")}/Library/Application Support/Steam/steamapps`,
	linux: () => `${os.getenv("HOME")}/.steam/steam/steamapps`,
});
if (!libraryFolders.length) libraryFolders.push(main);
export const steamGames = libraryFolders.map(y => nativefs.getDirectoryItems(y).filter(x => x.endsWith(".acf")).length).reduce((l, c) => l + c, 0);

export const exec = (script: string) => {
	const [handle] = io.popen(script);
	try {
		return handle!.read()!;
	} finally {
		handle?.close();
	}
};

export const getUsedMemory = matchOs(
	{
		win() {
			ffi.cdef(/* c */ `
			typedef struct _MEMORYSTATUSEX {
				unsigned long dwLength;
				unsigned long dwMemoryLoad;
				unsigned long long ullTotalPhys;
				unsigned long long ullAvailPhys;
				unsigned long long ullTotalPageFile;
				unsigned long long ullAvailPageFile;
				unsigned long long ullTotalVirtual;
				unsigned long long ullAvailVirtual;
				unsigned long long ullAvailExtendedVirtual;
			} MEMORYSTATUSEX;

			int GlobalMemoryStatusEx(MEMORYSTATUSEX *lpBuffer);
`);

			const memoryStatus = ffi.new("MEMORYSTATUSEX");
			memoryStatus.dwLength = ffi.sizeof(memoryStatus);
			return debounce(() => {
				ffi.C.GlobalMemoryStatusEx(memoryStatus);

				return Math.round(tonumber(memoryStatus.ullTotalPhys - memoryStatus.ullAvailPhys)! / 100000000)! / 10;
			}, 1000);
		},
	},
	() => () => 1
)!;

export const username = matchOs({
	win: () => os.getenv("USERNAME")!,
	mac: () => exec("id -F").trim(),
	linux: () => exec("whoami").trim(),
});
