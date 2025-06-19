import { initChemicals } from "./items/consumables/chemicals";
import { initJokers } from "./items/jokers/jokers";
import { initBlinds } from "./items/misc/blinds";
import { initEditions } from "./items/misc/editions";
import { updateTemperature } from "./util/arizona";
import { findJoker, hook, hookPlain, hsv2rgb, prefixed, prefixedJoker, scheduleEvent } from "./util/utils";

MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.createElement = (type, props = {}, ...children) => {
	const stringContents = children.length === 1 && typeof children[0] === "string" ? children[0] : null;
	const value = {
		n: { root: G.UIT.ROOT, row: G.UIT.R, text: G.UIT.T }[type as "root"],
		config: { ...props, text: children.length === 1 && typeof children[0] === "string" ? children[0] : props?.text },
		nodes: stringContents ? [] : children,
	} satisfies UINode;
	return value;
};
MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.hideNumbers = () => G.GAME.blind?.config?.blind?.key === prefixed("bl", "digit")
SMODS.Atlas({
	key: "myd-j-main",
	path: "jokers/main.png",
	px: 71,
	py: 95,
});

SMODS.Atlas({
	key: "myd-c-chemicals",
	path: "consumables/chemicals.png",
	px: 71,
	py: 95,
});

SMODS.Atlas({
	key: "myd-p-boosters",
	path: "misc/boosters.png",
	px: 71,
	py: 95,
});

SMODS.Atlas({
	key: "myd-m-blinds",
	path: "misc/blinds.png",
	atlas_table: "ANIMATION_ATLAS",
	px: 34,
	py: 34,
	frames: 21
});

SMODS.Shader({
	key: "outline",
	path: "outline.fs",
});
SMODS.Shader({
	key: "drenched",
	path: "drenched.fs",
});

G.C.FISH = [0, 0, 0, 1];
G.C.MYD_CHEMICAL = HEX("95c5c9");
initJokers();
initChemicals();
initBlinds();
initEditions();
hook(CardArea, "shuffle").after(function () {
	if (this === G.deck) {
		const floatation = findJoker("floatation");
		if (!floatation) return;
		G.deck.cards.sort((a, b) => Object.keys(SMODS.get_enhancements(a)).length - Object.keys(SMODS.get_enhancements(b)).length);
		card_eval_status_text(floatation, "extra", null, null, null, { message: "Shuffled!", colour: G.C.GREEN });
	}
});
let t = 0;
let init = false;
hook(Game, "update").before(() => {
	updateTemperature();
	t++;
	const rainbow = hsv2rgb(t * 10, 0.8, 0.8);
	G.C.FISH[0] = rainbow[0];
	G.C.FISH[1] = rainbow[1];
	G.C.FISH[2] = rainbow[2];
	if (!init && G.ARGS.LOC_COLOURS !== undefined) {
		G.ARGS.LOC_COLOURS.fish = G.C.FISH;
		G.ARGS.LOC_COLOURS.myd_chemical = G.C.MYD_CHEMICAL;
		init = true;
	}
});
hookPlain(love, "focus").before((meta, opened) => {
	if (opened) return;
	const you = findJoker("you");
	if (!you) return;
	if ((you.ability.extra.uses as number) <= 0 || you.ability.extra.using) return;
	SMODS.add_card({
		set: "Code",
		key: "c_cry_alttab",
		edition: {
			negative: true,
		},
		area: G.consumeables,
	});
	(you.ability.extra.uses as number)--;
	you.ability.extra.using = true;
	scheduleEvent(
		() => {
			you.ability.extra.using = false;
			return true;
		},
		{ delay: 0.5 }
	);
});
