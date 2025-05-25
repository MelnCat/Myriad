declare interface CardArea {
	cards: Card[];
	highlighted: Card[];
	remove_card(card: Card): void;
	shuffle(seed: string): void;
	unhighlight_all(): void;
	align_cards(): void;
	config: {
		card_limit: number;
	};
}
declare const CardArea: CardArea;
declare enum Suits {
	Hearts,
	Diamonds,
	Spades,
	Clubs,
}
type RGBA = [number, number, number, number];
declare interface BaseColors {
	[key: string]: RGBA;
}
declare type Colors = BaseColors & {
	SUITS: Record<keyof Suits, Suits & RGBA>;
	UI: Record<
		`${"TEXT" | "BACKGROUND"}_${"LIGHT" | "DARK" | "INACTIVE"}` | "BACKGROUND_WHITE" | `${"OUTLINE" | "TRANSPARENT"}_${"LIGHT" | "DARK"}` | "OUTLINE_LIGHT_TRANS" | "HOVER",
		RGBA
	>;
	DYN_UI: {
		MAIN: RGBA;
	};
	SET: Record<ObjectType, RGBA>;
};
declare type GameState = symbol;
interface UIDef {
	use_and_sell_buttons(this: void, card: Card): UINode;
}
declare interface UINodeConfig {
	ref_table: Card;
	r: number;
	padding: number;
	align: "bm";
	minw: number;
	minh: number;
	maxw: number;
	hover: boolean;
	shadow: boolean;
	colour: RGBA;
	one_press: boolean;
	button: string;
	func: string;
	text: string;
	scale: number;
}
declare interface UINode {
	n: Globals["UIT"][keyof Globals["UIT"]];
	config?: Partial<UINodeConfig>;
	nodes?: UINode[];
}
declare interface Globals {
	readonly play: CardArea;
	readonly jokers: CardArea;
	readonly hand: CardArea;
	readonly deck: CardArea;
	readonly consumeables: CardArea;
	readonly pack_cards: CardArea;
	playing_cards: Card[];
	E_MANAGER: EventManager;
	F_NO_ERROR_HAND: boolean;
	P_CARDS: Record<string, CardBase>;
	CONTROLLER: {
		hovering: {
			target?: Card;
		};
	};
	FUNCS: {
		react_card(this: void, e: { config: { ref_table: Card } }): void;
		end_consumeable(this: void, something: null, delay: number): void;
	};
	UIDEF: UIDef;
	C: Colors;
	ARGS: {
		LOC_COLOURS: {
			[key: string]: RGBA;
		};
	};
	GAME: {
		joker_buffer: number;
		pack_choices: number;
		chips: number;
		blind: {
			chips: number;
			in_blind: boolean;
		};
		probabilities: {
			normal: number;
		};
	};
	/** UI Types */
	UIT: {
		/** text */
		T: 1;
		/** box */
		B: 2;
		/** column */
		C: 3;
		/** row */
		R: 4;
		/** object (Node) */
		O: 5;
		/** root */
		ROOT: 7;
		/** slider */
		S: 8;
		/** text input box */
		I: 9;
		/** default padding */
		padding: 0;
	};
	STATE: GameState;
	STATE_COMPLETE: boolean;
	STATES: {
		DRAW_TO_HAND: GameState;
		HAND_PLAYED: GameState;
		SELECTING_HAND: GameState;
	};
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
type BaseContext = {
	cardarea: CardArea;
	full_hand: Card[];
	scoring_hand: unknown;
	scoring_name: string;
	poker_hands: unknown;
	blueprint: boolean;
	blueprint_card?: Card;

	before: false;
	main_scoring: false;
	individual: false;
	repetition: false;
	pre_joker: false;
	joker_main: false;
	other_joker: undefined;
	post_joker: false;
	final_scoring_step: false;
	destroy_card: null;
	remove_playing_cards: false;
	after: false;
	debuffed_hand: false;
	end_of_round: false;
	setting_blind: false;
	pre_discard: false;
	discard: false;
};
type SpecificContext<T extends keyof BaseContext, V = true> = {
	[K in keyof BaseContext]: K extends T ? V : BaseContext[K];
};
type NonScoringContext<T extends keyof BaseContext, V = true> = Omit<SpecificContext<T, V>, "scoring_hand" | "poker_hands" | "scoring_name" | "full_hand">;
type DiscardContext<T extends keyof BaseContext, V = true> = Omit<SpecificContext<T, V>, "scoring_hand" | "poker_hands" | "scoring_name">;
type CalculateContext =
	| SpecificContext<"before">
	| SpecificContext<"main_scoring">
	| (SpecificContext<"individual"> & {
			other_card: Card;
	  })
	| (SpecificContext<"repetition"> & {
			card_effects: unknown;
	  })
	| (SpecificContext<"pre_joker"> & {
			edition: true;
	  })
	| SpecificContext<"joker_main">
	| SpecificContext<"other_joker", Card>
	| (SpecificContext<"post_joker"> & {
			edition: true;
	  })
	| SpecificContext<"final_scoring_step">
	| (SpecificContext<"destroy_card", Card> & {
			destroying_card?: Card;
	  })
	| (NonScoringContext<"remove_playing_cards"> & {
			removed: Card[];
			scoring_hand?: unknown;
	  })
	| SpecificContext<"after">
	| SpecificContext<"debuffed_hand">
	| (NonScoringContext<"end_of_round"> & {
			game_over: boolean;
	  })
	| (NonScoringContext<"end_of_round" | "individual"> & {
			other_card: Card;
	  })
	| (NonScoringContext<"end_of_round" | "repetition"> & {
			other_card: Card;
			card_effects: unknown;
	  })
	| (NonScoringContext<"setting_blind"> & {
			blind: unknown;
	  })
	| (DiscardContext<"pre_discard"> & {
			hook: boolean;
	  })
	| (DiscardContext<"discard"> & {
			other_card: Card;
	  });

declare interface ScoreModifiers {
	chips?: number | Big;
	mult?: number | Big;
	xmult?: number | Big;
	dollars?: number | Big;

	chip_mod?: number;
	mult_mod?: number;
	xmult_mod?: number;
	dollar_mod?: number;

	swap?: boolean;
	level_up?: number;

	// Talisman
	emult?: number;
	eemult?: number;
	eeemult?: number;
	hypermult?: [number, number];

	emult_mod?: number;
	eemult_mod?: number;
	eeemult_mod?: number;
	hypermult_mod?: [number, number];

	xchips?: number;
	echips?: number;
	eechips?: number;
	eeechips?: number;
	hyperchips?: [number, number];

	[other: string]: unknown;
}

interface CalculateReturn extends ScoreModifiers {
	message?: string;
}
interface LocalizedText {
	name: string;
	text: string[] | string[][];
}
interface JokerOptions<EX, E extends CardAbility = CardAbility & EX> {
	key: string;
	name?: string;
	loc_txt?: LocalizedText;
	config?: EX;
	loc_vars?(info_queue: unknown, card: Card<E>): { vars: (string | number | undefined)[] };
	calculate?(card: Card<E>, context: CalculateContext): CalculateReturn | void;
	update?(card: Card<E>, dt: number): void;
	add_to_deck?(card: Card<E>, from_debuff: boolean): void;
	draw?(card: Card, layer: string): void;
	rarity?: 1 | 2 | 3 | 4 | "cry_epic";
	atlas?: string;
	pos?: { x: number; y: number };
	soul_pos?: { x: number; y: number; extra?: { x: number; y: number } };
	cost?: number;
	pixel_size?: { w: number; h: number };
}
interface AtlasOptions {
	key: string;
	path: string;
	px: number;
	py: number;
}
type Rarity = number | "myd_simple" | "myd_complex";
type ObjectType = "Joker" | "Tarot" | "Spectral" | "Code" /* cryptid */ | "RCode" /* entropy */ | "Chemical";
interface CreateCardOptions<T extends ObjectType> {
	set: T;
	area?: CardArea;
	legendary?: boolean;
	/**
	 * "Under vanilla conditions, values up to 0.7 indicate Common rarity, values above 0.7 and up to 0.95 indicate Uncommon rarity, and values above 0.95 indicate Rare rarity."
	 */
	rarity?: T extends "Joker" ? number : Rarity;
	skip_materialize?: boolean;
	soulable?: boolean;
	key?: string;
	key_append?: string;
	no_edition?: boolean;
	edition?: unknown;
	enhancement?: unknown;
	seal?: unknown;
	stickers?: unknown;
}
interface ObjectTypeOptions {
	key: string;
	default?: string;
	cards?: Record<string, boolean>;
	rarities?: { key: string; weight: number }[]; // bro "rate" isn't even real its "weight" despite the docs
}
interface ConsumableTypeOptions extends ObjectTypeOptions {
	primary_colour: RGBA;
	secondary_colour: RGBA;
	loc_txt?: {
		/** used on card type badges */
		name: string;
		/** label for the button to access the collection */
		collection: string;
		/** description for undiscovered cards in the collection  */
		undiscovered: {
			name: string;
			text: string[];
		};
	};
	collection_rows?: number[];
	shop_rate?: boolean;
}
interface UndiscoveredSpriteOptions {
	key: string;
	atlas: string;
	pos: { x: number; y: number };
	no_overlay?: boolean;
	overlay_pos?: { x: number; y: number };
}
interface ConsumableOptions<E extends CardAbility, C> {
	key: string;
	set: ObjectType;
	loc_txt?: LocalizedText;
	atlas?: string;
	pos?: { x: number; y: number };
	config?: C;
	unlocked?: boolean;
	discovered?: boolean;
	no_collection?: boolean;
	prefix_config?: unknown;
	dependencies?: unknown;
	display_size?: unknown;
	pixel_size?: { w: number; h: number };
	cost?: number;
	pools?: Partial<Record<ObjectType, boolean>>;
	hidden?: boolean;
	rarity?: string;
	calculate?(card: Card<E, C>, context: CalculateContext): CalculateReturn | void;
	loc_vars?(info_queue: unknown, card: Card<E, C>): { vars: (string | number | undefined)[] };
	use?(card: Card<E, C>, area: CardArea, copier: never): void;
	can_use?(card: Card<E, C>): boolean;
	keep_on_use?(card: Card<E, C>): boolean;
	set_ability?(card: Card<E, C>, initial: unknown, delay_sprites: unknown): void;
	add_to_deck?(card: Card<E, C>, from_debuff: boolean): void;
	remove_from_deck?(card: Card<E, C>, from_debuff: boolean): void;
	in_pool?(args: unknown): LuaMultiReturn<[boolean, { allow_duplicates: boolean }]>;
	update?(card: Card<E, C>, dt: number): void;
	set_sprites?(card: Card<E, C>, front: unknown): void;
	load?(card: Card<E, C>, card_table: unknown, other_card: Card): void;
	check_for_unlock?(args: unknown): boolean;
	set_badges?(card: Card, badges: Badge[]): void;
	set_card_type_badge?(card: Card, badges: Badge[]): void;
	draw?(card: Card<E, C>, layer: unknown): void;
}
type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
interface BoosterOptions {
	key: string;
	loc_txt?: LocalizedText;
	atlas?: string;
	pos?: { x: number; y: number };
	config?: { extra: number; choose: number };
	// ...
	cost?: number;
	weight?: number;
	draw_hand?: boolean;
	kind?: string;
	group_key?: string;
	select_card?: KeysOfType<Globals, CardArea>;
	create_card?(card: Card, index: number): Card | Parameters<(typeof SMODS)["create_card"]>;
	loc_vars?(info_queue: unknown, card: Card<CardAbility & { choose: number; extra: number }, { choose: number; extra: number }>): { vars: (string | number | undefined)[] };
	ease_background_colour(): void;
}
interface RarityOptions {
	key: string;
	loc_txt?: LocalizedText;
	pools?: Partial<Record<ObjectType, boolean | { rate: number }>>;
	badge_colour?: RGBA;
	default_weight?: number;
	get_weight?(weight: number, type: ObjectType): number;
}
interface ShaderOptions {
	key: string;
	path: string;
}
interface BlindOptions {
	key: string;
	loc_txt?: LocalizedText;
	atlas?: string;
	pos?: { x: number; y: number };
	dollars?: number;
	mult?: number;
	boss?: { min: number; showdown?: boolean };
	boss_colour?: RGBA;
	debuff?: {
		hand?: Record<string, boolean>
		h_size_ge?: number;
		h_size_le?: number;
		suit?: Suits;
		value?: string;
		nominal?: number;
		is_face?: boolean;
	}
	ignore_showdown_check?: boolean;
	vars?: unknown;
	set_blind?(): void;
	disable?(): void;
	defeat?(): void;
	drawn_to_hand?(): void;
	press_play?(): void;
	recalc_debuff?(card: Card, from_blind: boolean): boolean;
	debuff_hand?(cards: Card[], hand: unknown, handname: string, check: unknown): boolean;
	stay_flipped?(area: CardArea, card: Card): boolean;
	modify_hand?(cards: Card[], poker_hands: unknown, text: string, mult: number, hand_chips: number): LuaMultiReturn<[mult: number, hand_chips: number, changed: boolean]>
	get_loc_debuff_text?(): string;
	loc_vars?(): { vars?: (string | number | undefined)[], key?: string };
	collection_loc_vars?(): { vars?: (string | number | undefined)[], key?: string };
	in_pool?(): boolean;

}
type Enhancement = "m_bonus" | "m_mult" | "m_wild" | "m_glass" | "m_steel" | "m_stone" | "m_gold" | "m_lucky";

declare const SMODS: {
	Joker: <E>(this: void, opts: JokerOptions<E>) => void;
	Atlas: (this: void, opts: AtlasOptions) => void;
	Consumable: <E extends CardAbility, C>(this: void, opts: ConsumableOptions<E, C>) => void;
	ConsumableType: (this: void, opts: ConsumableTypeOptions) => void;
	UndiscoveredSprite: (this: void, opts: UndiscoveredSpriteOptions) => void;
	Booster: (this: void, opts: BoosterOptions) => void;
	Shader: (this: void, opts: ShaderOptions) => void;
	Rarity: (this: void, opts: RarityOptions) => void;
	Blind: (this: void, opts: BlindOptions) => void;
	//
	create_card: <T extends ObjectType>(this: void, opts: CreateCardOptions<T>) => Card;
	add_card: <T extends ObjectType>(this: void, opts: CreateCardOptions<T>) => void;
	has_enhancement(this: void, card: Card, enhancement: Enhancement): boolean;
	get_enhancements(this: void, card: Card, extra_only?: boolean): Record<Enhancement, boolean>;
	load_file(this: void, path: string): unknown;
	change_base(this: void, card: Card, suit?: Suits, rank?: string): void;
	modify_rank(this: void, card: Card, amount: number): LuaMultiReturn<[null, string] | [Card, null]>;
};
