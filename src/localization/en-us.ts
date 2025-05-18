import { localizationEntry } from "../util/utils";

export = localizationEntry({
	descriptions: {
		Joker: {
			theokisser: {
				name: "Theokisser",
				text: ["{X:fish,C:white}^^#1#{} Mult{}", "{C:red,E:2}self destructs after", "{C:red,E:2}hand is played"],
			},
			boykisser: {
				name: "Boykisser",
				text: [
					"Gains {X:mult,C:white}X#1#{} Mult{} when a",
					"{C:attention}King{} or {C:attention}Jack{} is scored",
					"{C:inactive}(Currently {X:mult,C:white}X#2#{C:inactive} Mult)",
				],
			},
			fortnitecard: {
				name: "19 Dollar Fortnite Card",
				text: ["When {C:attention}Blind{} is selected,", "create a random {C:attention}{C:green}Uncommon{C:attention} Joker", "{C:inactive}(Must have room)"],
			},
			jonkler: {
				name: "The Jonkler",
				text: ["{C:mult}#1#{} Mult", "{X:mult,C:white}X#2#{} Mult"],
			},
			birchtree: {
				name: "Birch Tree",
				text: [
					"All discarded cards have a",
					"{C:green}#1# in #2#{} chance to be {C:attention}destroyed{}",
					"Gains {X:dark_edition,C:white}^#3#{} for every card destroyed",
					"{C:inactive}(Currently {X:dark_edition,C:white}^#4#{C:inactive} Mult)",
					"{C:inactive,s:0.8,E:1}what a nice tree",
				],
			},
			floatation: {
				name: "Floatation",
				text: ["When the deck is shuffled,", "move all {C:attention}Enhanced cards{}", "to the {C:attention}top{} of the deck."],
			},
			arizona: {
				name: "Arizona",
				text: ["{C:mult}+#1#{} Mult for every °C of temperature", "in Arizona currently", "{C:inactive}(Currently {C:mult}+#2#{C:inactive} Mult)"],
			},
			steam: {
				name: "Steam",
				text: ["{C:mult}+#1#{} Mult for every", "{C:attention}steam game{} installed", "{C:inactive}(Currently {C:mult}+#2#{C:inactive} Mult)"],
			},
			dedotatedwam: {
				name: "Dedotated Wam",
				text: ["{X:mult,C:white}X#1#{} Mult for every {C:green}GB{}", "of {C:attention}RAM{} in use", "{C:inactive}(Currently {X:mult,C:white}X#2#{C:inactive} Mult)"],
			},
			you: {
				name: "#2#",
				text: ["Pressed {C:attention}key combinations{} create", "the corresponding {C:cry_code}Code Card{}", "{C:inactive}({C:attention}#1#{C:inactive} uses remaining)"],
			},
			squarepacking: {
				name: "Square Packing",
				text: ["Rounds Mult up to the", "nearest {C:attention}perfect square{}"],
			},
		},
		Chemical: {
			hydrogen: {
				name: "Hydrogen",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			oxygen: {
				name: "Oxygen",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			water: {
				name: "Water",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
		},
	},
});
