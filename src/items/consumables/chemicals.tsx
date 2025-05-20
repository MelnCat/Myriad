import { atlasConsumable, atlasMisc, hookPlain, scheduleEvent, unprefix } from "../../util/utils";
import * as json from "../../lib/json";
import { chemicalReactions } from "./reactions";
export const initChemicals = () => {
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
	const createChemical = <E extends CardAbility, C>(opts: Omit<ConsumableOptions<E, C>, "set">) =>
		SMODS.Consumable({
			atlas: "myd-c-chemicals",
			set: "Chemical",
			draw(card, layer) {
				const hovering = G.CONTROLLER.hovering.target?.config?.center?.key;
				if (!hovering || !hovering.startsWith("c_myd_")) return;
				if (hovering === this.key) return;
				if (chemicalReactions.filter(x => x.reactants.includes(unprefix(this.key))).some(x => x.reactants.includes(unprefix(hovering)))) {
					card.children.center.draw_shader("myd_outline", undefined, card.ARGS.send_to_shader);
					card.juice_up(0.1, 0.1);
				}
			},
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
	createChemical({
		key: "hydrogen",
		pos: atlasConsumable("chemicals", "hydrogen"),
		cost: 4,
	});
	createChemical({
		key: "oxygen",
		pos: atlasConsumable("chemicals", "oxygen"),
		cost: 4,
	});
	createChemical({
		key: "water",
		pos: atlasConsumable("chemicals", "water"),
		cost: 4,
	});
	createChemical({
		key: "carbon",
		pos: atlasConsumable("chemicals", "carbon"),
		cost: 4,
	});
	createChemical({
		key: "methane",
		pos: atlasConsumable("chemicals", "methane"),
		cost: 4,
	});
	createChemical({
		key: "carbondioxide",
		pos: atlasConsumable("chemicals", "carbondioxide"),
		cost: 4,
	});
};
