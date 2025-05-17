import * as nativefs from "../lib/nativefs";
import * as ffi from "ffi";

type Methods<T> = {
	[K in keyof T]: T[K] extends (this: T, ...args: any[]) => any ? K : never;
}[keyof T];
export const hook = <O, K extends Methods<O>>(obj: O, key: K) => {
	const old = obj[key] as (this: O) => void;
	let before = () => {};
	let after = () => {};
	obj[key] = function (this: O, ...args: Parameters<typeof old>) {
		before.call(this, ...args);
		old.call(this, ...args);
		after.call(this, ...args);
	} as O[K];
	return {
		before(cb: (this: O, ...args: O[K] extends (...args: any) => any ? Parameters<O[K]> : []) => void) {
			before = cb as () => void;
			return this;
		},
		after(cb: (this: O, ...args: O[K] extends (...args: any) => any ? Parameters<O[K]> : []) => void) {
			after = cb as () => void;
			return this;
		},
	};
};

export const hsv2rgb = (h: number, s: number, v: number) => {
	let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1)];
};

export const scheduleEvent = (func: () => boolean, opts?: Partial<EventObject>) => {
	G.E_MANAGER.add_event(
		Event({
			func,
			...opts,
		})
	);
};

export const prefixedJoker = (key: string) => `j_myriad_${key}`;

export const debounce = <T extends (...args: any[]) => any>(func: T, ms: number) => {
	let lastCall = 0;
	let lastReturn: ReturnType<T> = null as ReturnType<T>;
	return (...args: Parameters<T>) => {
		if (lastCall > love.timer.getTime() * 1000) return lastReturn;
		lastCall = love.timer.getTime() * 1000 + ms;
		return (lastReturn = func(...args));
	};
};

export const steamGames =
	nativefs.getDirectoryItems("C:\\Program Files (x86)\\Steam\\steamapps").filter(x => x.endsWith(".acf")).length ||
	nativefs.getDirectoryItems(`${os.getenv("HOME")}/Library/Application Support/Steam/steamapps`).filter(x => x.endsWith(".acf")).length ||
	nativefs.getDirectoryItems(`${os.getenv("HOME")}/.steam/steam/steamapps`).filter(x => x.endsWith(".acf")).length;

ffi.cdef(/* c */ `
    typedef unsigned long long ULL;
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

export const getUsedMemory = debounce(() => {
	ffi.C.GlobalMemoryStatusEx(memoryStatus);

	return Math.round(tonumber(memoryStatus.ullTotalPhys - memoryStatus.ullAvailPhys)! / 100000000)! / 10;
}, 1000);