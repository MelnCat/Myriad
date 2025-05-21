export interface ChemicalReaction {
	reactants: string[];
	products: string[];

}
export const chemicalReactions = [
	{
		reactants: ["hydrogen", "oxygen"],
		products: ["water"]
	},
	{
		reactants: ["methane", "oxygen"],
		products: ["carbondioxide", "water"]
	},
	{
		reactants: ["carbon", "oxygen"],
		products: ["carbondioxide"]
	},
	{
		reactants: ["carbondioxide", "hydrogen"],
		products: ["methane", "water"]
	},
	{
		reactants: ["chlorine", "hydrogen"],
		products: ["hydrochloricacid", "hydrochloricacid"]
	},
	{
		reactants: ["chlorine", "water"],
		products: ["hydrochloricacid", "hypochlorousacid"]
	},
	{
		reactants: ["nitrogen", "hydrogen"],
		products: ["ammonia"]
	},
]