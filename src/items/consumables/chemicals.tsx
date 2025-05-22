import { atlasConsumable, atlasMisc, debounce, hookPlain, runSelectedTarotEffects, scheduleEvent, scheduleEventAfter, unprefix } from "../../util/utils";
import * as json from "../../lib/json";
import { chemicalReactions } from "./reactions";
export const initChemicals = () => {
	SMODS.Rarity({
		key: "simple",
		default_weight: 1,
	});
	SMODS.Rarity({
		key: "complex",
		default_weight: 1,
	});
	SMODS.ConsumableType({
		key: "Chemical",
		primary_colour: G.C.MYD_CHEMICAL,
		secondary_colour: G.C.MYD_CHEMICAL,
		loc_txt: {
			name: "Chemical",
			collection: "Chemical Cards",
			undiscovered: {
				name: "Undiscovered Chemical",
				text: ["Find and use this in", "a run to discover."],
			},
		},
		rarities: [
			{ key: "myd_simple", weight: 1 },
			{ key: "myd_complex", weight: 0 },
		],
	});
	SMODS.Booster({
		key: "reagent_pack_1",
		kind: "Chemical",
		atlas: "myd-p-boosters",
		pos: atlasMisc("boosters", "reagentpack1"),
		cost: 4,
		config: { extra: 3, choose: 1 },
		select_card: "consumeables",
		create_card(card) {
			return SMODS.create_card({ set: "Chemical", area: G.pack_cards, skip_materialize: true, key_append: "reagent_pack" });
		},
		loc_vars(info_queue, card) {
			return {
				vars: [card?.ability?.choose ?? this.config?.choose, card?.ability?.extra ?? this.config?.extra],
			};
		},
		group_key: "k_myd_reagent_pack",
		ease_background_colour() {
			ease_colour(G.C.DYN_UI.MAIN, G.C.SET.Chemical);
			ease_background_colour({ new_colour: G.C.SET.Chemical, special_colour: G.C.BLACK, contrast: 2 });
		},
	});
	const createChemical =
		(type: "simple" | "complex") =>
		<E extends CardAbility, C>(opts: Omit<ConsumableOptions<E, C>, "set">) =>
			SMODS.Consumable({
				atlas: "myd-c-chemicals",
				set: "Chemical",
				draw(card, layer) {
					const hovering = G.CONTROLLER.hovering.target?.config?.center?.key;
					if (!hovering || !hovering.startsWith("c_myd_")) return;
					if (hovering === this.key) return;
					if (chemicalReactions.filter(x => x.reactants.includes(unprefix(this.key))).some(x => x.reactants.includes(unprefix(hovering)))) {
						card.children.center.draw_shader("myd_outline", undefined, card.ARGS.send_to_shader);
						if (!card._MYD) card._MYD = {};
						if (!card._MYD.shake_chemical) card._MYD.shake_chemical = debounce(() => card.juice_up(0.1, 0.1), 400);
						card._MYD.shake_chemical();
					}
				},
				rarity: `myd_${type}`,
				add_to_deck(card, from_debuff) {
					scheduleEvent(() => {
						if (!card.area) return false;
						scheduleEvent(
							() => {
								const area = card.area;
								if (!area) return true;
								const reactions = chemicalReactions.filter(x => x.reactants.includes(unprefix(this.key)));
								for (const reaction of reactions) {
									const cards = reaction.reactants.map(x => (x === unprefix(this.key) ? card : area.cards.find(y => unprefix(y.config.center.key) === x) ?? -1));
									if (!cards.includes(-1)) {
										for (const c of cards) {
											const car = c as Card;
											area.remove_card(car);
											car.remove();
										}
										for (const product of reaction.products) {
											SMODS.add_card({
												set: "Chemical",
												key: `c_myd_${product}`,
												area,
											});
										}
										break;
									}
								}
								return true;
							},
							{ delay: 4 }
						);
						return true;
					});
				},
				...opts,
			});
	const createSimpleChemical = createChemical("simple");
	const createComplexChemical = createChemical("complex");
	createSimpleChemical({
		key: "hydrogen",
		pos: atlasConsumable("chemicals", "hydrogen"),
		cost: 4,
		config: {
			max_highlighted: 2,
			rank_mod: 1,
		},
		loc_vars(info_queue, card) {
			return {
				vars: [card.ability.max_highlighted, card.ability.rank_mod],
			};
		},
		can_use(card) {
			return G.hand.highlighted.length > 0 && G.hand.highlighted.length <= card.ability.max_highlighted;
		},
		use(card, area) {
			runSelectedTarotEffects(card, c => SMODS.modify_rank(c, -1));
		},
	});
	createSimpleChemical({
		key: "oxygen",
		pos: atlasConsumable("chemicals", "oxygen"),
		cost: 4,
		config: {
			xscore: 1.5,
		},
		loc_vars(info_queue, card) {
			return { vars: [card.ability.xscore] };
		},
		can_use() {
			return G.GAME.blind.in_blind;
		},
		use(card) {
			play_sound("tarot1");
			card.juice_up(0.3, 0.5);
			const final = G.GAME.chips * card.ability.xscore;
			ease_chips(final);
			scheduleEvent(
				() => {
					if (G.STATE !== G.STATES.SELECTING_HAND) return false;
					if (final >= G.GAME.blind.chips) {
						G.STATE = G.STATES.HAND_PLAYED;
						G.STATE_COMPLETE = true;
						end_round();
					}
					return true;
				},
				{ delay: 0.3, blocking: false }
			);
		},
	});
	createComplexChemical({
		key: "water",
		pos: atlasConsumable("chemicals", "water"),
		cost: 4,
	});
	createSimpleChemical({
		key: "carbon",
		pos: atlasConsumable("chemicals", "carbon"),
		cost: 4,
	});
	createComplexChemical({
		key: "methane",
		pos: atlasConsumable("chemicals", "methane"),
		cost: 4,
	});
	createComplexChemical({
		key: "carbondioxide",
		pos: atlasConsumable("chemicals", "carbondioxide"),
		cost: 4,
	});
	createSimpleChemical({
		key: "chlorine",
		pos: atlasConsumable("chemicals", "chlorine"),
		cost: 4,
	});
	createComplexChemical({
		key: "hydrochloricacid",
		pos: atlasConsumable("chemicals", "hydrochloricacid"),
		cost: 4,
	});
	createComplexChemical({
		key: "hypochlorousacid",
		pos: atlasConsumable("chemicals", "hypochlorousacid"),
		cost: 4,
	});
	createComplexChemical({
		key: "methamphetamine",
		pos: atlasConsumable("chemicals", "methamphetamine"),
		cost: 2 * 47,
		can_use(card) {
			return true;
		},
	});
	createSimpleChemical({
		key: "nitrogen",
		pos: atlasConsumable("chemicals", "nitrogen"),
		cost: 4,
		can_use(card) {
			return true;
		},
	});
	createComplexChemical({
		key: "ammonia",
		pos: atlasConsumable("chemicals", "ammonia"),
		cost: 4,
		can_use(card) {
			return true;
		},
	});
	createComplexChemical({
		key: "chloroform",
		pos: atlasConsumable("chemicals", "chloroform"),
		cost: 4,
		can_use(card) {
			return true;
		},
	});

	G.FUNCS.react_card = e => {
		const card = e.config.ref_table;
		const reactions = chemicalReactions.filter(x => x.reactants.includes(unprefix(card.config.center.key)));
		scheduleEventAfter(() => {
			for (const reaction of reactions) {
				const cards = reaction.reactants.map(x =>
					x === unprefix(card.config.center.key) ? card : G.consumeables.cards.find(y => unprefix(y.config.center.key) === x) ?? -1
				);
				if (!cards.includes(-1)) {
					const toAdd = G.consumeables.config.card_limit - G.consumeables.cards.length + 1;
					for (const c of cards) {
						const car = c as Card;
						car.area.remove_card(car);
						car.remove();
					}
					for (const product of reaction.products.slice(0, toAdd)) {
						SMODS.add_card({
							set: "Chemical",
							key: `c_myd_${product}`,
							area: G.consumeables,
						});
					}
					card.children.price?.remove();
					delete card.children.price;
					card.children.buy_button?.remove();
					delete card.children.buy_button;
					G.GAME.pack_choices--;
					if (G.GAME.pack_choices <= 0) G.FUNCS.end_consumeable(null, 0.1);
					break;
				}
			}
		}, 0.1);
		return true;
	};

	hookPlain(G.UIDEF, "use_and_sell_buttons").before((card, early) => {
		if (!card.area || card.area !== G.pack_cards) return;
		if (card.ability.set !== "Chemical") return;
		if (G.consumeables.cards.length >= G.consumeables.config.card_limit) {
			const reactions = chemicalReactions
				.filter(x => x.reactants.includes(unprefix(card.config.center.key)))
				.map(x => x.reactants.toSpliced(x.reactants.indexOf(unprefix(card.config.center.key)), 1));

			if (reactions.some(x => G.consumeables.cards.filter(y => y.ability.set === "Chemical").some(y => x.includes(unprefix(y.config.center.key))))) {
				early(
					<root padding={-0.1} colour={G.C.CLEAR}>
						<row
							ref_table={card}
							r={0.08}
							padding={0.1}
							align="bm"
							minw={0.5 * card.T.w - 0.15}
							minh={0.7 * card.T.h}
							maxw={0.7 * card.T.w - 0.15}
							hover
							shadow
							colour={G.C.GREEN}
							one_press
							button="react_card"
						>
							<text colour={G.C.UI.TEXT_LIGHT} scale={0.4} shadow>
								{localize("b_react")}
							</text>
						</row>
					</root>
				);
			}
		}
	});
};
