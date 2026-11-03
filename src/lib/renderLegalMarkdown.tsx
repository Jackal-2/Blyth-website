import type { ReactNode } from "react";
import Link from "next/link";

// Turns the console's simple Markdown into page elements. Everything is
// rendered as text through React (never as raw HTML), so a document can't
// inject scripts or markup into the website.

type Block = { kind: "h2" | "h3" | "p"; text: string } | { kind: "ul"; items: string[] };

const MAX_BLOCKS = 5000;

function headingOf(line: string): { level: 2 | 3; text: string } | null {
  const m = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!m) return null;
  return { level: m[1].length >= 3 ? 3 : 2, text: m[2].trim() };
}

function isBullet(line: string): boolean {
  return /^[-*]\s+/.test(line);
}

function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length && blocks.length < MAX_BLOCKS) {
    const line = lines[i].trim();
    if (line === "") {
      i++;
      continue;
    }
    const heading = headingOf(line);
    if (heading) {
      if (heading.text) blocks.push({ kind: heading.level === 3 ? "h3" : "h2", text: heading.text });
      i++;
      continue;
    }
    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    // A paragraph always takes at least this line, so parsing can't stall.
    const paragraphLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (next === "" || headingOf(next) || isBullet(next)) break;
      paragraphLines.push(next);
      i++;
    }
    blocks.push({ kind: "p", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function safeHref(raw: string): { href: string; internal: boolean } | null {
  const href = raw.trim();
  if (/^\/(?!\/)[^\s<>"]*$/.test(href)) return { href, internal: true };
  if (/^https:\/\/[^\s<>"]+$/i.test(href)) return { href, internal: false };
  if (/^mailto:[^\s<>"@]+@[^\s<>"@]+$/i.test(href)) return { href, internal: false };
  return null;
}

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderInline(text: string, keyPrefix: string, allowBold = true): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${n++}`;
    if (m[1] !== undefined) {
      out.push(allowBold ? <strong key={key}>{renderInline(m[1], key, false)}</strong> : m[0]);
    } else {
      const label = m[2];
      const link = safeHref(m[3]);
      if (!link) {
        out.push(label);
      } else if (link.internal) {
        out.push(
          <Link key={key} href={link.href}>
            {label}
          </Link>,
        );
      } else {
        out.push(
          <a key={key} href={link.href} rel="noopener noreferrer nofollow" target={link.href.startsWith("mailto:") ? undefined : "_blank"}>
            {label}
          </a>,
        );
      }
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
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
    const k = `b${blockCount}`;
    if (block.kind === "h2") {
      flushSection();
      sectionChildren.push(<h2 key={k}>{renderInline(block.text, k)}</h2>);
    } else if (block.kind === "h3") {
      flushSubsection();
      subsectionChildren = [<h3 key={k}>{renderInline(block.text, k)}</h3>];
    } else if (block.kind === "ul") {
      currentTarget().push(
        <ul key={k}>
          {block.items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${k}-${idx}`)}</li>
          ))}
        </ul>,
      );
    } else {
      currentTarget().push(<p key={k}>{renderInline(block.text, k)}</p>);
    }
  }
  flushSection();

  return sections;
}
