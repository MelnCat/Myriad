import * as ffi from "ffi";
import * as nativefs from "../lib/nativefs";
import { debounce } from "./utils";

export const matchOs = <T>(obj: Partial<Record<"win" | "mac" | "linux", (() => T) | T>>, fallback?: T | (() => T)) => {
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

export const steamGames = nativefs
	.getDirectoryItems(
		matchOs({
			win: "C:\\Program Files (x86)\\Steam\\steamapps",
			mac: () => `${os.getenv("HOME")}/Library/Application Support/Steam/steamapps`,
			linux: () => `${os.getenv("HOME")}/.steam/steam/steamapps`,
		})
	)
	.filter(x => x.endsWith(".acf")).length;

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
