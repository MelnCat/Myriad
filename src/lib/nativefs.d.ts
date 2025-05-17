/** @noSelfInFile */
/** @noSelf */
interface File {
	getBuffer(): [string, number];
	getFilename(): string;
	getMode(): string;
	isOpen(): boolean;
	open(mode: string): [boolean, string];
	close(): [boolean, string];
	setBuffer(mode: string, size: number): [boolean, string];
	getSize(): number;
	read(containerOrBytes: "string" | "data" | number, bytes?: number | "all"): [string | FileData, number];
	lines(): () => string | undefined;
	write(data: string | FileData, size?: number | "all"): [boolean, string];
	seek(pos: number): boolean;
	tell(): number | [null, string];
	flush(): boolean | [null, string];
	isEOF(): boolean;
	release(): void;
	type(): "File";
	typeOf(t: string): boolean;
}

/** @noSelf */
interface FileData {
	getFFIPointer(): any;
	getSize(): number;
	getString(): string;
	release(): void;
}

/** @noSelf */
interface FileInfo {
	name?: string;
	type?: string;
	// Add other properties that might exist in the info object
}

/** @noSelf */
interface NativeFS {
	newFile(name: string): File;
	newFileData(filepath: string): [FileData | null, string];
	mount(archive: string, mountPoint: string, appendToPath: boolean): boolean;
	unmount(archive: string): boolean;
	read(containerOrName: "string" | "data" | string, nameOrSize?: string | number | "all", sizeOrNil?: number | "all"): [string | FileData | null, number | string];
	write(name: string, data: string | FileData, size?: number | "all"): [boolean, string];
	append(name: string, data: string | FileData, size?: number | "all"): [boolean, string];
	lines(name: string): (() => string | undefined) | [null, string];
	load(name: string): [(() => any) | null, string];
	getWorkingDirectory(): string | null;
	setWorkingDirectory(path: string): [boolean, string];
	getDriveList(): string[];
	createDirectory(path: string): [boolean, string];
	remove(name: string): [boolean, string];
	getDirectoryItems(dir: string): string[];
	getDirectoryItemsInfo(path: string, filtertype?: string): FileInfo[];
	getInfo(path: string, filtertype?: string): FileInfo | null;
}

declare const nativefs: NativeFS;
export = nativefs;
