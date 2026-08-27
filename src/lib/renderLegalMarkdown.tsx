import type { ReactNode } from "react";

// A small hand-rolled renderer for the one markdown subset the Legal
// Documents editor in Blyth-admin actually produces: "## " and "### "
// headings, "- " bullet lists, and plain paragraphs. Not a general markdown
// parser — deliberately, so the console's plain-textarea editor stays
// simple instead of needing a rich-text toolbar, while this still renders
// into the same policy-section / policy-subsection structure (and CSS) the
// old hardcoded pages used.

type Block = { kind: "h2" | "h3" | "p"; text: string } | { kind: "ul"; items: string[] };

function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "") {
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ kind: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (next === "" || next.startsWith("#") || next.startsWith("- ")) break;
      paragraphLines.push(next);
      i++;
    }
    blocks.push({ kind: "p", text: paragraphLines.join(" ") });
  }

  return blocks;
}

export function renderLegalDocument(body: string): ReactNode {
  const blocks = parseBlocks(body);
  const sections: ReactNode[] = [];
  let sectionChildren: ReactNode[] = [];
  let subsectionChildren: ReactNode[] | null = null;
  let sectionCount = 0;
  let subsectionCount = 0;
  let blockCount = 0;

  function currentTarget(): ReactNode[] {
    return subsectionChildren ?? sectionChildren;
  }

  function flushSubsection() {
    if (subsectionChildren) {
      sectionChildren.push(
        <div className="policy-subsection" key={`sub-${subsectionCount++}`}>
          {subsectionChildren}
        </div>,
      );
      subsectionChildren = null;
    }
  }

  function flushSection() {
    flushSubsection();
    if (sectionChildren.length > 0) {
      sections.push(
        <section className="policy-section" key={`sec-${sectionCount++}`}>
          {sectionChildren}
        </section>,
      );
    }
    sectionChildren = [];
  }

  for (const block of blocks) {
    blockCount++;
    if (block.kind === "h2") {
      flushSection();
      sectionChildren.push(<h2 key={`h-${blockCount}`}>{block.text}</h2>);
    } else if (block.kind === "h3") {
      flushSubsection();
      subsectionChildren = [<h3 key={`h-${blockCount}`}>{block.text}</h3>];
    } else if (block.kind === "ul") {
      currentTarget().push(
        <ul key={`ul-${blockCount}`}>
          {block.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>,
      );
    } else {
      currentTarget().push(<p key={`p-${blockCount}`}>{block.text}</p>);
    }
  }
  flushSection();

  return sections;
}
