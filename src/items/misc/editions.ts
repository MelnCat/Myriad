import { atlasMisc, hook } from "../../util/utils";

export const initEditions = () => {
	SMODS.Edition({
		key: "drenched",
		shader: "drenched",
		config: {
			xscore: 1.5,
		},
		calculate(card, context) {
			play_sound("tarot1");
			const final = G.GAME.chips * card.edition.xscore;
			ease_chips(final);
		},
		loc_vars(info_queue, card) {
			return { vars: [card.edition.xscore] };
		},
		disable_base_shader: true
	});

	hook(DynaText, "update").before(function () {
		if (
			(this.__myd_digitCheck === true && !MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.hideNumbers()) ||
			(MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.hideNumbers() && this.__myd_digitCheck !== true)
		) {
			this.__myd_digitCheck = MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED.hideNumbers();
			this.update_text(true);
			this.pop_in();
		}
	});
};
