import type {
  ADFDocument,
  ADFMark,
  ADFNode,
  ADFTableNode,
  ADFTextNode,
} from "../types/adf.js";

/**
 * Converts Atlassian Document Format (ADF) to Markdown
 */
export class ADFConverter {
  /**
   * Convert an ADF document to Markdown
   */
  public static convert(doc: ADFDocument): string {
    if (!doc.content) return "";
    return this.processContent(doc.content);
  }

  /**
   * Process an array of ADF nodes
   */
  private static processContent(content: ADFNode[]): string {
    return content.map((node) => this.processNode(node)).join("");
  }

  /**
   * Process a single ADF node
   */
  private static processNode(node: ADFNode): string {
    switch (node.type) {
      case "text":
        return this.convertText(node as ADFTextNode);
      case "paragraph":
        return this.convertParagraph(node);
      case "heading":
        return this.convertHeading(node);
      case "bulletList":
        return this.convertBulletList(node);
      case "orderedList":
        return this.convertOrderedList(node);
      case "listItem":
        return this.convertListItem(node);
      case "table":
        return this.convertTable(node as ADFTableNode);
      case "blockquote":
        return this.convertBlockquote(node);
      case "rule":
        return "---\n";
      case "hardBreak":
        return "\n";
      default:
        return node.text || "";
    }
  }

  /**
   * Convert text node with marks
   */
  private static convertText(node: ADFTextNode): string {
    if (!node.text) return "";

    let text = node.text;
    if (!node.marks || node.marks.length === 0) return text;

    // Apply marks in reverse order to handle nested marks correctly
    return node.marks.reduceRight((text, mark) => {
      return this.applyMark(text, mark);
    }, text);
  }

  /**
   * Apply mark to text
   */
  private static applyMark(text: string, mark: ADFMark): string {
    switch (mark.type) {
      case "strong":
        return `**${text}**`;
      case "em":
        return `*${text}*`;
      case "strike":
        return `~~${text}~~`;
      case "code":
        return `\`${text}\``;
      case "link":
        return mark.attrs?.href ? `[${text}](${mark.attrs.href})` : text;
      default:
        return text;
    }
  }

  /**
   * Convert paragraph node
   */
  private static convertParagraph(node: ADFNode): string {
    if (!node.content) return "\n\n";
    return `${this.processContent(node.content)}\n\n`;
  }

  /**
   * Convert heading node
   */
  private static convertHeading(node: ADFNode): string {
    if (!node.content) return "";
    const level = node.attrs?.level || 1;
    const hashes = "#".repeat(level);
    return `${hashes} ${this.processContent(node.content)}\n\n`;
  }

  /**
   * Convert bullet list node
   */
  private static convertBulletList(node: ADFNode): string {
    if (!node.content) return "";
    return this.processContent(node.content);
  }

  /**
   * Convert ordered list node
   */
  private static convertOrderedList(node: ADFNode): string {
    if (!node.content) return "";
    return this.processContent(node.content);
  }

  /**
   * Convert list item node
   */
  private static convertListItem(node: ADFNode): string {
    if (!node.content) return "";
    const parent = node.parent as ADFNode;
    const prefix = parent?.type === "orderedList" ? "1. " : "- ";
    return `${prefix}${this.processContent(node.content)}\n`;
  }

  /**
   * Convert table node
   */
  private static convertTable(node: ADFTableNode): string {
    if (!node.content) return "";

    const rows = node.content.map((row) => {
      if (!row.content) return "";
      return `| ${row.content
        .map((cell) => {
          if (!cell.content) return "";
          return this.processContent(cell.content).trim();
        })
        .join(" | ")} |`;
    });

    // Add header separator after first row
    if (rows.length > 0) {
      const columnCount = rows[0].split("|").length - 2; // -2 for leading/trailing |
      const separator = `|${" --- |".repeat(columnCount)}`;
      rows.splice(1, 0, separator);
    }

    return `${rows.join("\n")}\n\n`;
  }

  /**
   * Convert blockquote node
   */
  private static convertBlockquote(node: ADFNode): string {
    if (!node.content) return "";
    const content = this.processContent(node.content)
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
    return `${content}\n\n`;
  }
}
