/**
 * Atlassian Document Format (ADF) type definitions
 */

export type ADFNodeType =
  | "doc"
  | "paragraph"
  | "text"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "table"
  | "tableRow"
  | "tableCell"
  | "blockquote"
  | "rule"
  | "hardBreak"
  | "mention"
  | "emoji"
  | "inlineCard"
  | "mediaGroup"
  | "mediaSingle"
  | "media";

export interface ADFMark {
  type: "strong" | "em" | "strike" | "code" | "underline" | "link";
  attrs?: {
    href?: string;
    title?: string;
  };
}

export interface ADFNode {
  type: ADFNodeType;
  content?: ADFNode[];
  marks?: ADFMark[];
  attrs?: {
    level?: number;
    text?: string;
    url?: string;
    id?: string;
    [key: string]: any;
  };
  text?: string;
  parent?: ADFNode;
}

export interface ADFDocument {
  version: number;
  type: "doc";
  content: ADFNode[];
}

export interface ADFTableNode extends ADFNode {
  type: "table";
  content: ADFTableRowNode[];
}

export interface ADFTableRowNode extends ADFNode {
  type: "tableRow";
  content: ADFTableCellNode[];
}

export interface ADFTableCellNode extends ADFNode {
  type: "tableCell";
  content: ADFNode[];
}

export interface ADFTextNode extends ADFNode {
  type: "text";
  text: string;
  marks?: ADFMark[];
}
