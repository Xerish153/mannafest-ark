/**
 * Batch 7 — Textual-evidence types. Reusable across Mark 16 + John 21 this
 * batch; designed to be extensible for future passages (Jn 7:53–8:11,
 * 1 Jn 5:7, etc.) without schema churn.
 */

export type EvidenceVerdict = "Authentic" | "Disputed" | "Spurious";

export type ManuscriptWitness = {
  name: string;
  /** e.g. "4th century" or "c. 180" */
  date: string;
  /** Does the manuscript contain the passage in question? */
  contains: "present" | "absent" | "partial";
  note?: string;
};

export type ManuscriptCensusData = {
  summary: string;
  witnesses: ManuscriptWitness[];
};

export type PatristicCitation = {
  father: string;
  date: string; // e.g. "c. 180"
  work: string;
  locus?: string; // e.g., "III.10.6"
  quote?: string; // short direct quote when PD
  note?: string;
};

export type HeptaticAnalysisData = {
  source: string; // e.g., "Panin, Numeric Greek New Testament (1934, PD)"
  items: Array<{ label: string; value: string }>;
  note?: string;
};

export type IntegrationPoint = {
  heading: string;
  body: string;
};

export type EvidenceSourceCitation = {
  author: string;
  title: string;
  year: string;
  note?: string;
};

export type TextualEvidenceData = {
  passageTitle: string; // e.g., "Mark 16:9–20"
  verdict: EvidenceVerdict;
  manuscriptCensus: ManuscriptCensusData;
  patristicWitnesses?: PatristicCitation[];
  heptaticAnalysis?: HeptaticAnalysisData;
  theologicalIntegration: IntegrationPoint[];
  sources: EvidenceSourceCitation[];
  /** Brief plain-prose summary at the top of the panel. */
  executiveSummary: string;
  /** Unique slug for deep-link anchors (#textual-evidence default). */
  anchorId?: string;
};
