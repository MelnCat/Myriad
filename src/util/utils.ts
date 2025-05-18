import { atlasData } from "../data/atlas";

type Methods<T> = {
	[K in keyof T]: NonNullable<T[K]> extends (this: T, ...args: any[]) => any ? K : never;
}[keyof T];
type PlainMethods<T> = {
	[K in keyof T]: NonNullable<T[K]> extends (this: void, ...args: any[]) => any ? K : never;
}[keyof T];
export const hook = <O, K extends Methods<O>>(obj: O, key: K) => {
	const old = obj[key] as (this: O) => void;
	let before = () => {};
	let after = () => {};
	obj[key] = function (this: O, ...args: Parameters<typeof old>) {
		before.call(this, ...args);
		old?.call(this, ...args);
		after.call(this, ...args);
	} as O[K];
	return {
		before(cb: (this: O, ...args: NonNullable<O[K]> extends (...args: any) => any ? Parameters<NonNullable<O[K]>> : []) => void) {
			before = cb as () => void;
			return this;
		},
		after(cb: (this: O, ...args: NonNullable<O[K]> extends (...args: any) => any ? Parameters<NonNullable<O[K]>> : []) => void) {
			after = cb as () => void;
			return this;
		},
	};
};
export const hookPlain = <O, K extends PlainMethods<O>>(obj: O, key: K) => {
	const old = obj[key] as (this: void) => void;
	let before: (this: void) => void = () => {};
	let after: (this: void) => void = () => {};
	obj[key] = function (this: void, ...args: Parameters<typeof old>) {
		before(...args);
		old?.(...args);
		before(...args);
	} as O[K];
	return {
		before(cb: (this: void, ...args: NonNullable<O[K]> extends (...args: any) => any ? Parameters<NonNullable<O[K]>> : []) => void) {
			before = cb;
			return this;
		},
		after(cb: (this: void, ...args: NonNullable<O[K]> extends (...args: any) => any ? Parameters<NonNullable<O[K]>> : []) => void) {
			after = cb;
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

export const prefixedJoker = (key: string) => `j_myd_${key}`;

export const debounce = <T extends (...args: any[]) => any>(func: T, ms: number): T => {
	let lastCall = 0;
	let lastReturn: ReturnType<T> = null as ReturnType<T>;
	return ((...args: Parameters<T>) => {
		if (lastCall > love.timer.getTime() * 1000) return lastReturn;
		lastCall = love.timer.getTime() * 1000 + ms;
		return (lastReturn = func(...args));
	}) as T;
};
export const debounceOwned = <U, T extends (this: U, ...args: any[]) => any>(func: T, ms: number): T => {
	let lastCall = 0;
	let lastReturn: ReturnType<T> = null as ReturnType<T>;
	return function (this: U, ...args: Parameters<T>) {
		if (lastCall > love.timer.getTime() * 1000) return lastReturn;
		lastCall = love.timer.getTime() * 1000 + ms;
		return (lastReturn = func.call(this, ...args));
	} as T;
};

type AtlasCategory = keyof (typeof atlasData)["pos"];
export const atlasPos = <T extends AtlasCategory>(category: T, key: keyof (typeof atlasData)["pos"][T], name: string) =>
	(atlasData.pos[category][key] as Record<string, { x: number; y: number }>)[name];
export const atlasJoker = (key: keyof (typeof atlasData)["pos"]["jokers"], name: string) => atlasPos("jokers", key, name);
export const atlasConsumable = (key: keyof (typeof atlasData)["pos"]["consumables"], name: string) => atlasPos("consumables", key, name);
export const findJoker = (key: string) => G?.jokers?.cards?.find(x => x.config.center.key === prefixedJoker(key));

const prefixes = {
	Joker: "j",
	Chemical: "c",
};
export const localizationEntry = (entry: { descriptions: Record<"Joker" | "Chemical", Record<string, LocalizedText>> }) => ({
	descriptions: Object.fromEntries(Object.entries(entry.descriptions).map(([category, obj]) => [category, 
		Object.fromEntries(Object.entries(obj).map(x => [`${prefixes[category as "Joker"]}_myd_${x[0]}`, x[1]]))
	]))
})
