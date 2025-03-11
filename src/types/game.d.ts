declare const Game: {
	update(delta: number): void;
};
declare const play_sound: (this: void, sound: string) => void;

declare const localize: (this: void, opts: { type: "variable"; key: string; vars: (string | number)[] } | string) => string;
declare const card_eval_status_text: (
	this: void,
	card: Card,
	eval_type: "debuff" | "chips" | "mult" | "x_mult" | "h_mult" | "dollars" | "swap" | "extra",
	amt: number | null,
	percent: number | null,
	dir: "down" | null,
	extra?: { focus?: Card; colour?: RGBA; message: string /* todo */ }
) => void;
declare const pseudorandom: (this: void, key: string) => number;