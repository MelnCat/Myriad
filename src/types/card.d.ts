
declare interface Node {
	T: {
		scale: number;
		x: number;
		y: number;
		w: number;
		h: number;
		r: number;
	};
	draw(): void;
}
declare interface Moveable extends Node {
	__myd_revolving?: number;
}
declare interface UIElement extends Moveable {
	update_text(): void;
	draw_self(): void;
	update_object(): void;
	calculate_xywh(node: Node, _T: unknown, recalculate: unknown, _scale: number): void;
	update(): void;
	UIBox?: UIBox;
	config?: {
		text?: string;
		text_drawable?: import("love.graphics").Text;
		ref_table?: Record<string, string>;
		ref_value?: string;
		prev_value?: string;
	}
}
declare interface UIBox extends Moveable {
	definition: any;
	config: any;
}
declare interface DynaText extends Moveable {
}
declare const UIElement: UIElement;
declare const UIBox: UIBox;
declare const Sprite: Sprite;
declare const Moveable: Moveable;
declare const Node: Node;
declare const DynaText: DynaText;
declare interface Sprite extends Moveable {
	x: number;
	y: number;
	w: number;
	h: number;
	atlas: any;
	pos: any;
	states: {
		drag: {
			is: boolean;
		};
	};
	pinch: {
		x: boolean;
		y: boolean;
	};
	scale: any;
	role: any;
	parent: any;
	layered_parallax: any;
	VT: {
		r: number;
		scale: number;
	};
	set_sprite_pos(pos: any): void;
	draw_shader(
		_shader: string,
		_shadow_height?: number,
		_send?: number[],
		_no_tilt?: boolean,
		other_obj?: unknown,
		ms?: unknown,
		mr?: unknown,
		mx?: unknown,
		my?: unknown,
		custom_shader?: unknown,
		tilt_shadow?: unknown
	): void;
	draw(overlay?: unknown): void;
	remove(): void;
	juice_up(scale?: number, rot_amount?: number): void;
}

interface CardAbility {
	extra: ScoreModifiers;
	set: ObjectType;
}
declare interface CardBase {
	suit: Suits;
	id: number;
	value: number;
}
declare interface Card<E = unknown, C = unknown> extends Sprite {
	ARGS: {
		send_to_shader: number[];
	};
	playing_card: any;
	sort_id: number;
	back: string;
	bypass_discovery_center: boolean;
	bypass_discovery_ui: boolean;
	bypass_lock: boolean;
	no_ui: boolean;
	base_cost: number;
	extra_cost: number;
	cost: number;
	sell_cost: number;
	sell_cost_label: number;
	unique_val: number;
	edition: any;
	zoom: boolean;
	discard_pos: {
		r: number;
		x: number;
		y: number;
	};
	facing: string;
	sprite_facing: string;
	flipping: any;
	area: CardArea;
	highlighted: boolean;
	click_timeout: number;
	debuff: boolean;
	added_to_deck: any;
	ability: E & { name: string } & CardAbility & C;
	base: any;
	seal: any;
	sticker: any;
	sticker_run: any;
	REMOVED: boolean;
	children: {
		front: Sprite;
		back: Sprite;
		center: Sprite;
		floating_sprite: Sprite;
		price?: Sprite;
		buy_button?: Sprite;
		alert: UIBox;
		particles: any;
	};
	opening: boolean;
	dissolve: number;
	dissolve_colours: any[];
	juice: any;
	shattered: boolean;
	getting_sliced: boolean;
	vampired: boolean;
	config: {
		center: {
			key: string;
		};
	} & C;

	init(X: number, Y: number, W: number, H: number, card: any, center: any, params?: any): void;
	update_alert(): void;
	set_base(card: any, initial?: boolean): void;
	set_sprites(_center: any, _front: any): void;
	set_ability(center: any, initial?: boolean, delay_sprites?: boolean): void;
	set_cost(): void;
	set_edition(edition: any, immediate?: boolean, silent?: boolean): void;
	set_seal(_seal: any, silent?: boolean, immediate?: boolean): void;
	get_seal(bypass_debuff?: boolean): any;
	set_eternal(_eternal: boolean): void;
	set_perishable(_perishable: boolean): void;
	set_rental(_rental: boolean): void;
	set_debuff(should_debuff: boolean): void;
	remove_UI(): void;
	change_suit(new_suit: string): void;
	add_to_deck(from_debuff?: boolean): void;
	remove_from_deck(from_debuff?: boolean): void;
	generate_UIBox_unlock_table(hidden?: boolean): any;
	generate_UIBox_ability_table(): any;
	get_nominal(mod?: string): number;
	/**
	 * The rank. J: 11, Q: 12, K: 13, A: 14
	 */
	get_id(): number;
	is_face(from_boss?: boolean): boolean;
	get_original_rank(): any;
	get_chip_bonus(): number;
	get_chip_mult(): number;
	get_chip_x_mult(context?: any): number;
	get_chip_h_mult(): number;
	get_chip_h_x_mult(): number;
	get_edition(): any;
	get_end_of_round_effect(context?: any): any;
	get_p_dollars(): number;
	use_consumeable(area: any, copier?: any): void;
	can_use_consumeable(any_state?: boolean, skip_check?: boolean): boolean;
	check_use(): boolean;
	sell_card(): void;
	can_sell_card(context?: any): boolean;
	calculate_dollar_bonus(): number;
	open(): void;
	redeem(): void;
	apply_to_run(center?: any): void;
	explode(dissolve_colours?: any[], explode_time_fac?: number): void;
	shatter(): void;
	start_dissolve(dissolve_colours?: any[], silent?: boolean, dissolve_time_fac?: number, no_juice?: boolean): void;
	start_materialize(dissolve_colours?: any[], silent?: boolean, timefac?: number): void;
	calculate_seal(context?: any): any;
	calculate_rental(): void;
	calculate_perishable(): void;
	calculate_joker(context?: any): any;
	remove(): void;
	is_suit(suit: Suits): boolean;
	flip(): void;
	_MYD?: any;
}
