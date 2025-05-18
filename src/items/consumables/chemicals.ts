import { atlasConsumable } from "../../util/utils";

export const initChemicals = () => {
	SMODS.ConsumableType({
		key: "Chemical",
		primary_colour: HEX("ff0000"),
		secondary_colour: HEX("95c5c9"),
		loc_txt: {
			name: "Chemical",
			collection: "Chemical Cards",
			undiscovered: {
				name: "Undiscovered Chemical",
				text: ["Find and use this in", "a run to discover."]
			}
		}
	});
	SMODS.Consumable({
		key: "hydrogen",
		set: "Chemical",
		atlas: "myd-c-chemicals",
		pos: atlasConsumable("chemicals", "hydrogen"),
		cost: 4
	})
	SMODS.Consumable({
		key: "oxygen",
		set: "Chemical",
		atlas: "myd-c-chemicals",
		pos: atlasConsumable("chemicals", "oxygen"),
		cost: 4
	})
	SMODS.Consumable({
		key: "water",
		set: "Chemical",
		atlas: "myd-c-chemicals",
		pos: atlasConsumable("chemicals", "water"),
		cost: 4
	})
}