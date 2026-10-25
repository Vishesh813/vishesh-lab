export type Track = "dsa" | "systems" | "case-study";

export type ModuleMeta = {
  slug: string;
  step: number;
  title: string;
  phase: string;
  topics: string[];
  track?: Track;
};
