import { atlasPos } from "./util/constants";
import { hook, hsv2rgb, scheduleEvent } from "./util/utils";

SMODS.Atlas({
	key: "myd-main",
	path: "jokers/main.png",
	px: 71,
	py: 95,
});

G.C.FISH = [0, 0, 0, 1];
SMODS.Joker({
	key: "theokisser",
	name: "myd-theokisser",
	loc_txt: {
		name: "Theokisser",
		text: ["{X:fish,C:white}^^#1#{} Mult{}", "{C:red,E:2}self destructs after", "{C:red,E:2}hand is played"],
	},
	loc_vars(_, card) {
		return { vars: [card.ability.extra.eemult] };
	},
	atlas: "myd-main",
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
	pos: atlasPos(0),
	rarity: 3,
	cost: 8,
});
SMODS.Joker({
	key: "boykisser",
	name: "myd-boykisser",
	loc_txt: {
		name: "Boykisser",
		text: [
			"Gains {X:mult,C:white}X#1#{} Mult{} when a",
			"{C:attention}King{} or {C:attention}Jack{} is scored",
			"{C:inactive}(Currently {X:mult,C:white}X#2#{C:inactive} Mult)",
		],
	},
	loc_vars(_, card) {
		return { vars: [card.ability.extra.xmult_mod, card.ability.extra.xmult] };
	},
	atlas: "myd-main",
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
	pos: atlasPos(1),
	soul_pos: atlasPos(2),
	rarity: 4,
	cost: 20,
});
SMODS.Joker({
	key: "fortnitecard",
	name: "myd-fortnitecard",
	loc_txt: {
		name: "19 Dollar Fortnite Card",
		text: [
			"When {C:attention}Blind{} is selected,",
			"create an {C:attention}{C:green}Uncommon{C:attention} Joker",
			"{C:inactive}(Must have room)",
			"{C:inactive,s:0.8,E:1}Trolls, don't get blocked",
		],
	},
	atlas: "myd-main",
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
	pos: atlasPos(3),
	rarity: 2,
	cost: 19,
});
SMODS.Joker({
	key: "jonkler",
	name: "myd-jonkler",
	loc_txt: {
		name: "The Jonkler",
		text: ["{C:mult}#1#{} Mult", "{X:mult,C:white}X#2#{} Mult", "{C:inactive,s:0.8,E:1}I'm the Jonkler, baby!"],
	},
	loc_vars(_, card) {
		return { vars: [card.ability.extra.mult, card.ability.extra.xmult] };
	},
	config: {
		extra: { mult: -16, xmult: 2.5 },
	},
	atlas: "myd-main",
	calculate(card, context) {
		if (context.joker_main)
			return {
				mult: card.ability.extra.mult,
				xmult: card.ability.extra.xmult,
			};
	},
	pos: atlasPos(4),
	rarity: 2,
	cost: 7,
});
SMODS.Joker({
	key: "birchtree",
	name: "myd-birchtree",
	loc_txt: {
		name: "Birch Tree",
		text: [
			"All discarded cards have a",
			"{C:green}#1# in #2#{} chance to be {C:attention}destroyed{}",
			"Gains {X:dark_edition,C:white}^#3#{} for every card discarded",
			"{C:inactive}(Currently {X:dark_edition,C:white}^#4#{C:inactive} Mult)",
			"{C:inactive,s:0.8,E:1}what a nice tree",
		],
	},
	loc_vars(_, card) {
		return { vars: [G.GAME.probabilities.normal ?? 1, card.ability.extra.odds, card.ability.extra.emult_mod, card.ability.extra.emult] };
	},
	config: {
		extra: { emult: 1, emult_mod: 0.1, odds: 3 },
	},
	atlas: "myd-main",
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
	pos: atlasPos(5),
	rarity: 3,
	cost: 7,
});
let t = 0;
let init = false;
hook(Game, "update").before(() => {
	t++;
	const rainbow = hsv2rgb(t * 10, 0.8, 0.8);
	G.C.FISH[0] = rainbow[0];
	G.C.FISH[1] = rainbow[1];
	G.C.FISH[2] = rainbow[2];
	if (!init && G.ARGS.LOC_COLOURS !== undefined) {
		G.ARGS.LOC_COLOURS.fish = G.C.FISH;
		init = true;
	}
});
