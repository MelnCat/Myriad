// This file will be automatically filled
import * as json from "../lib/json";

interface AtlasData {
	jokerPos: {
		main: Record<string, {x: number, y: number}>;
	};
}
export const atlasData: AtlasData = {
	jokerPos: json.decode("<data>")
};
