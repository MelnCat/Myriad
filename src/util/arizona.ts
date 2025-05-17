import * as https from "SMODS.https";
import * as json from "../lib/json";
import { debounce } from "./utils";

let currentTemperature = 20;

export const getCurrentTemperature = () => currentTemperature;
export const updateTemperature = debounce(() => {
	https.asyncRequest(
		"https://api.open-meteo.com/v1/forecast?latitude=33.4619553410817&longitude=-112.09621571775192&current=temperature_2m&forecast_days=1&format=json",
		(code, body, headers) => {
			currentTemperature = Math.round(json.decode(body!.toString()).current.temperature_2m);
		}
	);
}, 1000 * 5 * 60)