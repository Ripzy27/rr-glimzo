/** A paragraph, or a bulleted list when given an array of items. */
export type LegalBlock = string | string[];

export interface LegalDocument {
  title: string;
  /** Paragraphs before the first heading. */
  intro: LegalBlock[];
  sections: { heading: string; blocks: LegalBlock[] }[];
}
