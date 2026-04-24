// Batch 7-B — Jesus Titles Cluster types.
//
// Kept deliberately narrow — rows read from Supabase are typed here so the
// render tree can type-check without pulling in a full @supabase codegen.

export type JesusTitleStatus = "draft" | "published";

export type JesusTitleOriginalLanguage =
  | "hebrew"
  | "greek"
  | "aramaic"
  | null;

export type JesusTitleClusterGroup =
  | "identity"
  | "sacrificial_office"
  | "cosmic"
  | "relational"
  | "royal"
  | "incarnational"
  | "i-am"
  | null;

export type JesusTitleRefType =
  | "ot_type"
  | "nt_declaration"
  | "nt_fulfillment"
  | "eschatological";

export interface JesusTitle {
  id: number;
  slug: string;
  name: string;
  original_language: JesusTitleOriginalLanguage;
  original_text: string | null;
  transliteration: string | null;
  pronunciation: string | null;
  summary: string | null;
  origin_body: string | null;
  declaration_body: string | null;
  theological_meaning_body: string | null;
  display_order: number;
  cluster_group: JesusTitleClusterGroup;
  status: JesusTitleStatus;
  created_at: string;
  updated_at: string;
}

export interface JesusTitleRef {
  id: number;
  title_id: number;
  ref_type: JesusTitleRefType;
  book_id: number;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  note: string | null;
  display_order: number;
  created_at: string;
  // Joined when fetched together — books(name, abbreviation).
  book?: { name: string; abbreviation: string } | null;
}

export interface JesusTitleWithRefs extends JesusTitle {
  refs: JesusTitleRef[];
}

// Cluster-group labels for the hub visual.
export const CLUSTER_GROUP_LABELS: Record<
  Exclude<JesusTitleClusterGroup, null>,
  string
> = {
  identity: "Identity",
  sacrificial_office: "Sacrificial Office",
  cosmic: "Cosmic",
  relational: "Relational",
  royal: "Royal",
  incarnational: "Incarnational",
  "i-am": "I AM",
};

// Display ordering of the cluster-group rows on the hub.
export const CLUSTER_GROUP_ORDER: Array<
  Exclude<JesusTitleClusterGroup, null>
> = [
  "identity",
  "sacrificial_office",
  "cosmic",
  "i-am",
  "royal",
  "relational",
  "incarnational",
];
