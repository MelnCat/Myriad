/**
 * @noResolution
 * @noSelf
 */
declare module "SMODS.https" {
	interface RequestOptions {
		headers?: Record<string, string>; // Additional headers as key-value pairs
		method?: "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "PATCH"; // HTTP method
		data?: string | Record<string, any>; // Data to send, typically form data or JSON
	}

	interface RequestResponse {
		code: number; // HTTP status code (0 on failure)
		body: string | null; // Response body or error description
		headers: Record<string, string> | null; // Response headers or null on failure
	}

	export function request(url: string, options?: RequestOptions): RequestResponse;

	export function asyncRequest(
		url: string,
		optionsOrCallback: RequestOptions | ((code: number, body: string | null, headers: Record<string, string> | null) => void),
		callback?: (code: number, body: string | null, headers: Record<string, string> | null) => void
	): void;
}
