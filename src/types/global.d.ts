declare var MYRIAD_INTERNAL_IF_YOU_USE_THIS_YOU_ARE_FIRED: {
	hideNumbers: () => boolean;
	require(this: void, module: string): unknown;
	createElement(type: string | Function, props: Partial<UINodeConfig>, ...children: any[]): any;
};

declare namespace JSX {
	interface IntrinsicElements {
		root: Partial<UINodeConfig>;
		row: Partial<UINodeConfig>;
		text: Partial<UINodeConfig> & {children?: string};
	}
	type Element = UINode;
}
