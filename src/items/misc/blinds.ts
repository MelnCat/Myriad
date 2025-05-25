import { atlasMisc, hook } from "../../util/utils";

export const initBlinds = () => {
	SMODS.Blind({
		key: "digit",
		atlas: "myd-m-blinds",
		pos: atlasMisc("blinds", "digit"),
		boss_colour: HEX("d8d662"),
		boss: { min: 1 },
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
