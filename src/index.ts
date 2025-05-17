import { initJokers } from "./jokers/jokers";
import { getCurrentTemperature, updateTemperature } from "./util/arizona";
import { atlasPos } from "./util/constants";
import { hook, hsv2rgb, prefixedJoker, scheduleEvent, steamGames } from "./util/utils";

SMODS.Atlas({
	key: "myd-main",
	path: "jokers/main.png",
	px: 71,
	py: 95,
});

G.C.FISH = [0, 0, 0, 1];
initJokers();
hook(CardArea, "shuffle").after(function () {
	if (this === G.deck) {
		const floatation = G.jokers.cards.find(x => x.config.center.key === prefixedJoker("floatation"));
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
		init = true;
	}
});
