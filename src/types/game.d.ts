declare const Game: {
	update(delta: number): void;
};
declare const play_sound: (this: void, sound: string, volume?: number, pitch?: number) => void;

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
declare let mult: number;
declare let chips: number;
declare const HEX: (this: void, hex: string) => RGBA;
declare interface Badge {
	____: "badge";
}
declare const create_badge: (this: void, text: string, bgColor?: RGBA, textColor?: RGBA, scaling?: number) => Badge;
declare const create_card: (
	this: void,
	_type: unknown,
	area: unknown,
	legendary: unknown,
	_rarity: unknown,
	skip_materialize: unknown,
	soulable: unknown,
	forced_key: unknown,
	key_append: unknown
) => Card;
declare const ease_colour: (this: void, old_colour: RGBA, new_colour: RGBA, delay?: number) => void;
declare const ease_background_colour: (this: void, opts: { new_colour: RGBA; special_colour: RGBA; contrast: number }) => void;
declare const delay: (this: void, seconds: number) => void;