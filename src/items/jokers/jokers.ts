import { atlasData } from "../../data/atlas";
import { getCurrentTemperature } from "../../util/arizona";
import { getUsedMemory, steamGames, username } from "../../util/system";
import { atlasJoker, debounce, debounceOwned, scheduleEvent } from "../../util/utils";

enum JokerRarity {
	COMMON = 1,
	UNCOMMON,
	RARE,
	LEGENDARY,
}

export const initJokers = () => {
	SMODS.Joker({
		key: "theokisser",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.eemult] };
		},
		atlas: "myd-j-main",
		config: {
			extra: { eemult: 7.12 },
		},
		calculate(card, context) {
			if ("joker_main" in context) {
				scheduleEvent(() => {
					play_sound("tarot1");
					card.T.r = -0.2;
					card.juice_up(0.3, 0.4);
					card.states.drag.is = true;
					card.children.center.pinch.x = true;
					scheduleEvent(
						() => {
							G.jokers.remove_card(card);
							card.remove();
							return true;
						},
						{ trigger: "after", delay: 0.3, blockable: false }
					);
					return true;
				});
				return {
					eemult: card.ability.extra.eemult,
				};
			}
		},
		pos: atlasJoker("main", "dont"),
		rarity: JokerRarity.RARE,
		cost: 8,
	});
	SMODS.Joker({
		key: "boykisser",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.xmult_mod, card.ability.extra.xmult] };
		},
		atlas: "myd-j-main",
		config: {
			extra: { xmult: 1, xmult_mod: 0.25 },
		},
		calculate(card, context) {
			if (context.joker_main && card.ability.extra.xmult !== 1) {
				return {
					xmult: card.ability.extra.xmult,
				};
			} else if (context.cardarea === G.play && context.individual && !context.blueprint) {
				const other = context.other_card;
				if (other.debuff || ![11, 13].includes(other.get_id())) return;

				card.ability.extra.xmult += card.ability.extra.xmult_mod;
				return {
					message: localize("k_upgrade_ex"),
					card: card,
					colour: G.C.XMULT,
				};
			}
		},
		pos: atlasJoker("main", "boykisser_bg"),
		soul_pos: atlasJoker("main", "boykisser_fg"),
		rarity: JokerRarity.LEGENDARY,
		cost: 20,
	});
	SMODS.Joker({
		key: "fortnitecard",
		atlas: "myd-j-main",
		calculate(card, context) {
			if (context.setting_blind && !card.getting_sliced) {
				if (G.GAME.joker_buffer + G.jokers.cards.length + 1 > G.jokers.config.card_limit) return;
				G.GAME.joker_buffer++;
				scheduleEvent(() => {
					SMODS.add_card({
						set: "Joker",
						rarity: 0.9,
					});
					G.GAME.joker_buffer = 0;
					return true;
				});
				card_eval_status_text(context.blueprint_card ?? card, "extra", null, null, null, { message: localize("k_plus_joker"), colour: G.C.GREEN });
			}
		},
		add_to_deck(card, from_debuff) {
			card.sell_cost = 0;
		},
		pos: atlasJoker("main", "fortnitecard"),
		rarity: JokerRarity.UNCOMMON,
		cost: 19,
	});
	SMODS.Joker({
		key: "jonkler",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.mult, card.ability.extra.xmult] };
		},
		config: {
			extra: { mult: -16, xmult: 2.5 },
		},
		atlas: "myd-j-main",
		calculate(card, context) {
			if (context.joker_main)
				return {
					mult: card.ability.extra.mult,
					xmult: card.ability.extra.xmult,
				};
		},
		pos: atlasJoker("main", "jonkler"),
		rarity: JokerRarity.COMMON,
		cost: 7,
	});
	SMODS.Joker({
		key: "birchtree",
		loc_vars(_, card) {
			return { vars: [G.GAME.probabilities.normal ?? 1, card.ability.extra.odds, card.ability.extra.emult_mod, card.ability.extra.emult] };
		},
		config: {
			extra: { emult: 1, emult_mod: 0.05, odds: 3 },
		},
		atlas: "myd-j-main",
		calculate(card, context) {
			if (context.discard && !context.blueprint) {
				if (pseudorandom("myd-birchtree") > G.GAME.probabilities.normal / card.ability.extra.odds) return;
				card.ability.extra.emult += card.ability.extra.emult_mod;
				return {
					message: localize("k_upgrade_ex"),
					card: card,
					colour: G.C.XMULT,
					remove: true,
				};
			} else if (context.joker_main)
				return {
					emult: card.ability.extra.emult,
				};
		},
		pos: atlasJoker("main", "birchtree"),
		rarity: JokerRarity.RARE,
		cost: 7,
	});
	SMODS.Joker({
		key: "floatation",
		atlas: "myd-j-main",
		pos: atlasJoker("main", "floatation"),
		rarity: JokerRarity.RARE,
		cost: 7,
	});
	SMODS.Joker({
		key: "arizona",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.mult_mod, card.ability.extra.mult] };
		},
		config: {
			extra: { mult: 0, mult_mod: 1 },
		},
		atlas: "myd-j-main",
		pos: atlasJoker("main", "arizona"),
		rarity: JokerRarity.COMMON,
		cost: 3,
		calculate(card, context) {
			if (context.joker_main)
				return {
					mult: card.ability.extra.mult,
				};
		},
		update(card, dt) {
			card.ability.extra.mult = card.ability.extra.mult_mod * getCurrentTemperature();
		},
	});
	SMODS.Joker({
		key: "steam",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.mult_mod, card.ability.extra.mult] };
		},
		config: {
			extra: { mult: steamGames, mult_mod: 1 },
		},
		atlas: "myd-j-main",
		pos: atlasJoker("main", "steam"),
		rarity: JokerRarity.COMMON,
		cost: 3,
		calculate(card, context) {
			if (context.joker_main)
				return {
					mult: card.ability.extra.mult,
				};
		},
	});
	SMODS.Joker({
		key: "dedotatedwam",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.xmult_mod, card.ability.extra.xmult] };
		},
		config: {
			extra: { xmult: 0, xmult_mod: 1 },
		},
		atlas: "myd-j-main",
		pos: atlasJoker("main", "dedotatedwam"),
		rarity: JokerRarity.RARE,
		cost: 3,
		calculate(card, context) {
			if (context.joker_main)
				return {
					xmult: card.ability.extra.xmult,
				};
		},
		update(card, dt) {
			card.ability.extra.xmult = card.ability.extra.xmult_mod * getUsedMemory() - 1;
		},
	});
	SMODS.Joker({
		key: "you",
		loc_vars(_, card) {
			return { vars: [card.ability.extra.uses, username] };
		},
		config: {
			extra: { uses: 5, using: false },
		},
		atlas: "myd-j-main",
		pos: atlasJoker("main", "you"),
		rarity: JokerRarity.COMMON,
		cost: 6,
		update(card, dt) {
			if (card.ability.extra.uses <= 0 || card.ability.extra.using) return;
			const key =
				love.keyboard.isDown("lctrl", "rctrl") && love.keyboard.isDown("v")
					? "c_cry_ctrl_v"
					: love.keyboard.isDown("delete")
					? "c_cry_delete"
					: love.keyboard.isDown("/")
					? "c_cry_divide"
					: love.keyboard.isDown("8") && love.keyboard.isDown("lshift", "rshift")
					? "c_cry_multiply"
					: null;
			if (key) {
				SMODS.add_card({
					set: "Code",
					key,
					edition: {
						negative: true,
					},
					area: G.consumeables,
				});
				card.ability.extra.uses--;
				card.ability.extra.using = true;
				scheduleEvent(
					() => {
						card.ability.extra.using = false;
						return true;
					},
					{ delay: 0.5 }
				);
				return;
			}
			const rkey = love.keyboard.isDown("lctrl", "rctrl") && love.keyboard.isDown("x") ? "c_entr_ctrl_x" : null;
			if (rkey) {
				SMODS.add_card({
					set: "RCode",
					key: rkey,
					edition: {
						negative: true,
					},
					area: G.consumeables,
				});
				card.ability.extra.uses--;
				card.ability.extra.using = true;
				scheduleEvent(
					() => {
						card.ability.extra.using = false;
						return true;
					},
					{ delay: 0.5 }
				);
				return;
			}
		},
	});
	SMODS.Joker({
		key: "squarepacking",
		atlas: "myd-j-main",
		pos: atlasJoker("main", "squarepacking"),
		pixel_size: { w: 71, h:71 },
		rarity: JokerRarity.COMMON,
		cost: 3,
		calculate(card, context) {
			if (context.joker_main)
				return {
					mult: Math.ceil(Math.sqrt(mult)) ** 2 - mult,
				};
		}
	});
};
