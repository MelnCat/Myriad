export const ATLAS_WIDTH = 4;
export const JOKER_WIDTH = 71;
export const JOKER_HEIGHT = 95;

export const atlasPos = (index: number) => ({ x: (index % ATLAS_WIDTH), y: Math.floor(index / ATLAS_WIDTH) });
