import { atlasPos } from "./util/constants";
import { hook, hsv2rgb, scheduleEvent } from "./util/utils";

SMODS.Atlas({
	key: "myriad-main",
	path: "jokers/main.png",
	px: 71,
	py: 95,
});

G.C.FISH = [0, 0, 0, 1];
SMODS.Joker({
	key: "theokisser",
	name: "Theokisser",
	loc_txt: {
		name: "Theokisser",
		text: ["{X:fish,C:white}^^#1#{} Mult{}", "{C:red,E:2}self destructs after", "{C:red,E:2}hand is played"],
	},
	loc_vars(_, card) {
		return { vars: [card.ability.extra.eemult] };
	},
	atlas: "myriad-main",
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
	rarity: 3
});
SMODS.Joker({
	key: "boykisser",
	name: "Boykisser",
	loc_txt: {
		name: "Boykisser",
		text: ["{X:fish,C:white}^^#1#{} Mult{}", "{C:red,E:2}self destructs after", "{C:red,E:2}hand is played"],
	},
	loc_vars(_, card) {
		return { vars: [card.ability.extra.eemult] };
	},
	atlas: "myriad-main",
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
	pos: atlasPos(1),
	soul_pos: atlasPos(2),
	rarity: 4
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
