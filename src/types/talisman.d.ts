declare class Big {
    private array: number[];
    private sign: number;

    constructor(value: number | string | Big);

    static create(value: number | string | Big): Big;

    isNaN(): boolean;
    isInfinite(): boolean;
    isFinite(): boolean;
    isInt(): boolean;

    compareTo(other: Big): number;
    lt(other: Big): boolean;
    gt(other: Big): boolean;
    lte(other: Big): boolean;
    gte(other: Big): boolean;
    eq(other: Big): boolean;

    neg(): Big;
    abs(): Big;
    min(other: Big): Big;
    max(other: Big): Big;

    add(other: Big): Big;
    sub(other: Big): Big;
    mul(other: Big): Big;
    div(other: Big): Big;
    mod(other: Big): Big;

    pow(exponent: Big): Big;
    root(degree: Big): Big;
    logBase(base?: Big): Big;
    log10(): Big;
    ln(): Big;

    tetrate(height: Big): Big;
    arrow(arrows: number, other: Big): Big;
    slog(base?: Big): Big;

    lambertw(): Big;

    toNumber(): number;
    toString(): string;
    clone(): Big;
}


declare function to_big(x: number | string | Big, y?: number): Big;
declare function to_number(x: Big | number): number;