export const hook = <T extends string, U, V>(obj: Record<T, (this: U, ...args: V[]) => void>, key: T) => {
	const old = obj[key];
	let before: (this: U, ...args: V[]) => void = () => {};
	let after: (this: U, ...args: V[]) => void = () => {};
	obj[key] = function (...args: V[]) {
		before.call(this, ...args);
		old.call(this, ...args);
		after.call(this, ...args);
	};
	return {
		before(cb: (this: U, ...args: V[]) => void) {
			before = cb;
		},
		after(cb: (this: U, ...args: V[]) => void) {
			before = cb;
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
