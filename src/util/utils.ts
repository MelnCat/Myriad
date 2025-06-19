import { atlasData } from "../data/atlas";

type Methods<T> = {
	[K in keyof T]: NonNullable<T[K]> extends (this: T, ...args: any[]) => any ? K : never;
}[keyof T];
type PlainMethods<T> = {
	[K in keyof T]: NonNullable<T[K]> extends (this: void, ...args: any[]) => any ? K : never;
}[keyof T];
type NReturnType<T extends (...args: any) => any | undefined | null> = T extends (...args: any) => infer R ? R : any;

interface BeforeMeta<T> {
	earlyReturn: (value: T) => void;
}
interface AfterMeta<T> {
	returnValue: T;
	overrideReturn: (value: T) => void;
}

export const hook = <O, K extends Methods<O>>(obj: O, key: K) => {
	const old = obj[key] as (this: O) => void;
	let before = (...args: any) => {};
	let after = (...args: any) => {};
	obj[key] = function (this: O, ...args: Parameters<typeof old>) {
		let earlyReturn = false;
		let value: unknown = null;
		before.call(
			this,
			{
				earlyReturn: (v: unknown) => {
					value = v;
					earlyReturn = true;
				},
			},
			...args
		);
		if (earlyReturn) return value;
		value = old?.call(this, ...args);
		after.call(
			this,
			{
				returnValue: value,
				overrideReturn: (v: unknown) => {
					value = v;
				},
			},
			...args
		);
		return value;
	} as O[K];
	return {
		before(cb: (this: O, ...args: NonNullable<O[K]> extends (...args: infer T) => infer U ? [BeforeMeta<U>, ...T] : []) => void) {
			before = cb as () => void;
			return this;
		},
		after(cb: (this: O, ...args: NonNullable<O[K]> extends (...args: infer T) => infer U ? [AfterMeta<U>, ...T] : []) => void) {
			after = cb as () => void;
			return this;
		},
	};
};
export const hookPlain = <O, K extends PlainMethods<O>>(obj: O, key: K) => {
	const old = obj[key] as (this: void) => void;
	let before: (this: void, ...args: any) => void = () => {};
	let after: (this: void, ...args: any) => void = () => {};
	obj[key] = function (this: void, ...args: Parameters<typeof old>) {
		let earlyReturn = false;
		let value: unknown = null;
		before(
			{
				earlyReturn: (v: unknown) => {
					value = v;
					earlyReturn = true;
				},
			},
			...args
		);
		if (earlyReturn) return value;
		value = old?.(...args);
		after(
			{
				returnValue: value,
				overrideReturn: (v: unknown) => {
					value = v;
				},
			},
			...args
		);
		return value;
	} as O[K];
	return {
		before(cb: (this: void, ...args: NonNullable<O[K]> extends (...args: infer T) => infer U ? [BeforeMeta<U>, ...T] : []) => void) {
			before = cb;
			return this;
		},
		after(cb: (this: void, ...args: NonNullable<O[K]> extends (...args: infer T) => infer U ? [AfterMeta<U>, ...T] : []) => void) {
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
export const scheduleEventAfter = (func: () => void, time: number) => {
	G.E_MANAGER.add_event(
		Event({
			func: () => {
				func();
				return true;
			},
			trigger: "after",
			delay: time,
		})
	);
};

export const runSelectedTarotEffects = (card: Card, cb: (c: Card) => void) => {
	scheduleEventAfter(() => {
		play_sound("tarot1");
		card.juice_up(0.3, 0.5);
		return true;
	}, 0.4);
	let i = 0;
	for (const c of G.hand.highlighted) {
		scheduleEventAfter(() => {
			c.flip();
			play_sound("card1", 1.15 - ((i - 0.999) / (G.hand.highlighted.length - 0.998)) * 0.3);
			c.juice_up(0.3, 0.3);
			return true;
		}, 0.15);
	}
	delay(0.2);
	for (const c of G.hand.highlighted) {
		scheduleEventAfter(() => {
			cb(c);
		}, 0.1);
	}
	for (const c of G.hand.highlighted) {
		scheduleEventAfter(() => {
			c.flip();
			play_sound("tarot2", 0.85 + ((i - 0.999) / (G.hand.highlighted.length - 0.998)) * 0.3, 0.6);
			c.juice_up(0.3, 0.3);
			return true;
		}, 0.15);
	}
	scheduleEventAfter(() => {
		G.hand.unhighlight_all();
		return true;
	}, 0.2);
	delay(0.5);
};

export const prefixedJoker = (key: string) => `j_myd_${key}`;

export const prefixed = (prefix: string, key: string) => `${prefix}_myd_${key}`;

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
export const animateJoker = (card: Card, frames: { x: number; y: number }[], delay: number = 60) => {
	card.children.center.set_sprite_pos(frames[Math.floor((love.timer.getTime() / delay * 1000) % frames.length)]);
};

type AtlasCategory = keyof (typeof atlasData)["pos"];
export const atlasPos = <T extends AtlasCategory>(category: T, key: keyof (typeof atlasData)["pos"][T], name: string) =>
	(atlasData.pos[category][key] as Record<string, { x: number; y: number }>)[name];
export const atlasJoker = (key: keyof (typeof atlasData)["pos"]["jokers"], name: string) => atlasPos("jokers", key, name);
export const atlasConsumable = (key: keyof (typeof atlasData)["pos"]["consumables"], name: string) => atlasPos("consumables", key, name);
export const atlasMisc = (key: keyof (typeof atlasData)["pos"]["misc"], name: string) => atlasPos("misc", key, name);
export const findJoker = (key: string) => G?.jokers?.cards?.find(x => x.config.center.key === prefixedJoker(key));

const prefixes = {
	Joker: "j",
	Chemical: "c",
	Blind: "bl",
};
export const localizationEntry = (entry: {
	descriptions: Record<"Joker" | "Chemical" | "Other" | "Blind", Record<string, LocalizedText>>;
	misc: { dictionary: Record<string, string>; labels: Record<string, string> };
}) => ({
	descriptions: Object.fromEntries(
		Object.entries(entry.descriptions).map(([category, obj]) => [
			category,
			Object.fromEntries(
				Object.entries(obj).map(x => [
					category === "Other" ? `${x[0].split("_")[0]}_myd_${x[0].split("_").slice(1).join("_")}` : `${prefixes[category as "Joker"]}_myd_${x[0]}`,
					x[1],
				])
			),
		])
	),
	misc: entry.misc,
});
export const unprefix = (key: string) => key.split("_").slice(2).join("_");
