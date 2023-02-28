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
      const content = b.content;
      if (content.startsWith(headers)) {
        await logseq.Editor.updateBlock(
          b.uuid,
          `${content.replace(headers, "")}`
        );
      } else {
        await logseq.Editor.updateBlock(b.uuid, `${headers} ${content}`);
      }
    }
    logseq.hideMainUI();
  }

  async function setBoldItalic(flag: string) {
    for (const b of props.selectedBlocks) {
      const content = b.content;

      if (flag === "bold") {
        const boldRegexp = /\*\*(.*)\*\*/;
        if (!boldRegexp.exec(content)) {
          await logseq.Editor.updateBlock(b.uuid, `**${content}**`);
        } else if (content === boldRegexp.exec(content)![0]) {
          await logseq.Editor.updateBlock(b.uuid, content.replaceAll("**", ""));
        }
      } else {
        const italicRegexp = /\*(.*)\*/;
        if (!italicRegexp.exec(content)) {
          await logseq.Editor.updateBlock(b.uuid, `*${content}*`);
        } else if (content === italicRegexp.exec(content)![0]) {
          await logseq.Editor.updateBlock(b.uuid, content.replaceAll("*", ""));
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
            className="py-1 px-2 rounded-md bg-green-800 text-white"
          >
            {`H` + h}
          </button>
        ))}{" "}
        |{" "}
        <button
          onClick={() => setBoldItalic("bold")}
          className="py-1 px-2 rounded-md bg-green-800 text-white font-bold"
        >
          Bold
        </button>
        <button
          onClick={() => setBoldItalic("italic")}
          className="py-1 px-2 rounded-md bg-green-800 text-white italic"
        >
          Italic
        </button>
      </div>
    </div>
  );
}
