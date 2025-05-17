/**
 * @noResolution
 */
declare module "ffi" {
	type CType = string;
	type CValue = number | string | boolean | bigint | null | ArrayBuffer | Uint8Array;
	/** @noSelf **/
	interface CData<T = any> {
		[key: string]: any;
	}
	interface ForeignFunction {
		(this: void, ...args: CValue[]): CValue;
	}
	/** @noSelf **/
	interface FFILibrary {
		[key: string]: ForeignFunction & CData;
	}
	/** @noSelf **/
	interface FFI {
		cdef(definition: string): void;
		load(lib: string, symbols?: Record<string, CType>): FFILibrary;
		cast<T = any>(ctype: CType, value: CValue): CData<T>;
		typeof(ctype: CData): string;
		sizeof(ctype: CType | CData): number;
		alignof(ctype: CType | CData): number;
		offsetof(ctype: CType, field: string): number;
		new <T = any>(ctype: CType, count?: number): CData<T>;
		metatype<T = any>(ctype: CType, metatable: object): CData<T>;
		gc<T = any>(cdata: CData<T>, destructor?: (cdata: CData<T>) => void): CData<T>;
		string(ptr: CData | ArrayBuffer, length?: number): string;
		istype(ctype: CType | CData, obj: any): boolean;
		["new"](...args: any[]): any;
		C: FFILibrary;
	}

	const ffi: FFI;
	export = ffi;
}
