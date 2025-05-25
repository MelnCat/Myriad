// This file will be automatically filled
import * as json from "../lib/json";

interface AtlasData {
	pos: {
		jokers: {
			main: Record<string, { x: number; y: number }>;
		};
		consumables: {
			chemicals: Record<string, { x: number; y: number }>;
		};
		misc: {
			boosters: Record<string, { x: number; y: number }>;
			blinds: Record<string, { x: number; y: number }[]>;
		};
	};
	anim: {
		jokers: {
			main: Record<string, { x: number; y: number }[]>;
		};
		misc: {
			blinds: Record<string, { x: number; y: number }[]>;
		};
	};
}
export const atlasData: AtlasData = {
	pos: json.decode("<data>"),
	anim: json.decode("<animdata>"),
};
