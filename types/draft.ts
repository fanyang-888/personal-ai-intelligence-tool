export type Draft = {
  id: string;
  clusterId: string;
  title: string;
  topic?: string;
  /** Primary body; use `variants` for regenerate rotation */
  body: string;
  /** Additional full-text variants for local “regenerate” (2–3 total including body) */
  variants?: string[];
  takeaways: string[];
  careerInterpretation: string;
};
