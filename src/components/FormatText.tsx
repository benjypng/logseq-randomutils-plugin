import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { useState } from "react";
import "./App.css";

export default function FormatText(props: { selectedBlocks: BlockEntity[] }) {
  const [headings] = useState([1, 2, 3, 4, 5, 6]);

  async function addHeading(header: number) {
    let headers: string = "";
    for (let i = 0; i < header; i++) {
      headers = headers + "#";
    }
    for (const b of props.selectedBlocks) {
      if (b.content.startsWith(headers)) {
        await logseq.Editor.updateBlock(
          b.uuid,
          `${b.content.replace(headers, "")}`
        );
      } else {
        await logseq.Editor.updateBlock(b.uuid, `${headers} ${b.content}`);
      }
    }
    logseq.hideMainUI();
  }

  async function addAutoHeading() {
    for (const b of props.selectedBlocks) {
      if (b.properties?.heading) {
        await logseq.Editor.removeBlockProperty(b.uuid, "heading");
      } else {
        await logseq.Editor.upsertBlockProperty(b.uuid, "heading", true);
      }
    }
    logseq.hideMainUI();
  }

  async function setBoldItalic(flag: string) {
    const r1 = /^\*\*\*(.+)\*\*\*/;
    const r2 = /^\*\*(.+)\*\*/;
    const r3 = /^\*(.+)\*/;

    for (const b of props.selectedBlocks) {
      const content = b.content;

      const r1matched = r1.exec(content);
      const r2matched = r2.exec(content);
      const r3matched = r3.exec(content);

      // If 3*, means can only remove.
      if (r1matched) {
        if (flag === "bold") {
          await logseq.Editor.updateBlock(
            b.uuid,
            content.substring(2, content.length - 2)
          );
        } else if (flag === "italic") {
          await logseq.Editor.updateBlock(
            b.uuid,
            content.substring(1, content.length - 1)
          );
        }

        // If 2*, means it's bold. Hence if click on bold, it will remove bold, but if click on italic, then it becomes 3*
      } else if (r2matched) {
        if (flag === "bold") {
          await logseq.Editor.updateBlock(b.uuid, r2matched[1]);
        } else if (flag === "italic") {
          console.log(content);
          await logseq.Editor.updateBlock(b.uuid, `*${content}*`);
        }

        // If 1*, means it's italic. Hence if click on bold, it will become 3 stars, but if click on italic, it becomes 0*.
      } else if (r3matched) {
        if (flag === "bold") {
          await logseq.Editor.updateBlock(b.uuid, `**${content}**`);
        } else if (flag === "italic") {
          await logseq.Editor.updateBlock(
            b.uuid,
            content.substring(1, content.length - 1)
          );
        }
      } else {
        if (flag === "bold") {
          await logseq.Editor.updateBlock(b.uuid, `**${content}**`);
        } else if (flag === "italic") {
          await logseq.Editor.updateBlock(b.uuid, `*${content}*`);
        }
      }
    }
    logseq.hideMainUI();
  }

  return (
    <div className="flex justify-center border border-black">
      <div
        className="absolute top-20 bg-white rounded-lg p-3 w-auto border flex flex-row gap-3"
        id="powerblocks-menu"
      >
        {headings.map((h) => (
          <button
            name={h.toString()}
            onClick={() => addHeading(h)}
            className="py-1 px-2 rounded-md border border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
          >
            {`H` + h}
          </button>
        ))}
        <button
          onClick={addAutoHeading}
          className="py-1 px-2 rounded-md border border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
        >
          Auto-Heading
        </button>
        <button
          onClick={() => setBoldItalic("bold")}
          className="py-1 px-2 rounded-md border border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
        >
          Bold
        </button>
        <button
          onClick={() => setBoldItalic("italic")}
          className="py-1 px-2 rounded-md border border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
        >
          Italic
        </button>
      </div>
    </div>
  );
}
