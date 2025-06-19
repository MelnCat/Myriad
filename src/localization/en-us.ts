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
			revolvingjoker: {
				name: "Revolving Joker",
				text: ["Sets Mult to {X:mult,C:white}#1#M^2 - #2#M + #3#{}", "{C:inactive}Mult, but at what cost?"],
			},
			maxwell: {
				name: "Maxwell",
				text: ["{X:mult,C:white}X#1#{} Mult", "{C:green}#2# in #3#{} chance to {S:1.1,C:red,E:2}shut down{}", "your computer instead"],
			},
			ooiiaa: {
				name: "OO II AA",
				text: ["oia"]
			}
		},
		Chemical: {
			hydrogen: {
				name: "Hydrogen",
				text: ["Decreases rank of", "up to {C:attention}#1#{} selected", "cards by {C:attention}#2#"],
			},
			oxygen: {
				name: "Oxygen",
				text: ["{X:purple,C:white}X#1#{} Score"],
			},
			water: {
				name: "Water",
				text: ["e"],
			},
			carbon: {
				name: "Carbon",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			methane: {
				name: "Methane",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			carbondioxide: {
				name: "Carbon Dioxide",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			chlorine: {
				name: "Chlorine",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			hydrochloricacid: {
				name: "Hydrochloric Acid",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			hypochlorousacid: {
				name: "Hypochlorous Acid",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			methamphetamine: {
				name: "Methamphetamine",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			nitrogen: {
				name: "Nitrogen",
				text: ["{X:attention,C:white}X2{} choices in currently", "opened {C:attention}Booster Pack{}"],
			},
			ammonia: {
				name: "Ammonia",
				text: ["Todo whatever this is", "{C:attention}supposed{} to do"],
			},
			chloroform: {
				name: "Chloroform",
				text: ["Adds up to {C:attention}2{} {C:mult}children{} into", "your basement", "{C:inactive}(Must have room)"],
			}
		},
		Other: {
			p_reagent_pack_1: {
				name: "Reagent Pack",

				text: ["Choose {C:attention}#1#{} of up to", "{C:attention}#2# {C:myd_chemical}Chemical{} card#<s>2#"],
			},
		},
		Blind: {
			digit: {
				name: "The Digit",
				text: ["All {C:attention}numbers{} are hidden"],
			},
		},
	},
	misc: {
		dictionary: {
			k_myd_reagent_pack: "Reagent Pack",
			k_myd_simple: "Element",
			k_myd_complex: "Compound",
			b_react: "REACT"
		},
		labels: {
			k_myd_simple: "Element",
			k_myd_complex: "Compound"
		}
	},
});
