declare enum CardArea {
	Play,
	Jokers,
	Hand,
}
type RGBA = [number, number, number, number];
declare interface Colors {
	[key: string]: RGBA;
}
declare interface Globals {
	readonly play: CardArea.Play & { cards: Card[] };
	readonly jokers: CardArea.Jokers & {
		remove_card(card: Card): void;
	};
	readonly hand: CardArea.Hand;
	E_MANAGER: EventManager;
	C: Colors;
	ARGS: {
		LOC_COLOURS: {
			[key: string]: RGBA
		}
	}
}
declare const G: Globals;
declare interface EventObject {
	trigger: "immediate" | "after" | "condition" | "ease" | "before";
	blocking: boolean;
	blockable: boolean;
	func: () => boolean;
	delay: number;
	ref_table: unknown;
	ref_value: unknown;
	stop_val: number;
	ease_to: number;
	ease: "lerp" | "elastic" | "quad";
	no_delete: boolean;
	start_timer: boolean;
	force_pause: boolean;
	timer: "REAL" | "TOTAL";
}
declare const Event: {
	(this: void, opts: Partial<EventObject>): EventObject;
};
interface EventManager {
	add_event(event: EventObject): void;
}
type CalculateContext =
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			before: true;
	  }
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			main_scoring: true;
	  }
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			individual: true;
			other_card: Card;
	  }
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			repetition: true;
			card_effects: unknown;
	  }
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			edition: true;
			pre_joker: true;
	  }
	| {
			cardarea: CardArea;
			full_hand: Card[];
			scoring_hand: unknown;
			scoring_name: string;
			poker_hands: unknown;
			joker_main: true;
	  };

declare interface ScoreModifiers {
	chips?: number;
	mult?: number;
	xmult?: number;
	dollars?: number;

	swap?: boolean;
	level_up?: number;

	// Talisman
	emult?: number;
	eemult?: number;
	eeemult?: number;
	hypermult?: [number, number];

	xchips?: number;
	echips?: number;
	eechips?: number;
	eeechips?: number;
	hyperchips?: [number, number];
}

interface CalculateReturn extends ScoreModifiers {}

interface JokerOptions {
	key: string;
	name?: string;
	loc_txt: {
		name: string;
		text: string[];
	};
	config?: {
		extra: ScoreModifiers;
	};
	loc_vars?(info_queue: unknown, card: Card): { vars: (string | number | undefined)[] };
	calculate?(card: Card, context: CalculateContext): CalculateReturn | void;
	rarity?: 1 | 2 | 3 | 4;
	atlas?: string;
	pos?: { x: number; y: number };
	soul_pos?: { x: number; y: number };
	cost?: number;
}
interface AtlasOptions {
	key: string;
	path: string;
	px: number;
	py: number;
}
declare const SMODS: {
	Joker: (this: void, opts: JokerOptions) => void;
	Atlas: (this: void, opts: AtlasOptions) => void;
};
