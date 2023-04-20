import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  IBatchBlock,
  SettingSchemaDesc,
} from "@logseq/libs/dist/LSPlugin.user";
import { getDateForPageWithoutBrackets } from "logseq-dateutils";
import FormatText from "./components/FormatText";
import handleClosePopup from "./handlePopup";
import axios from "axios";

function provideStyle() {
  const { fontSize, lineHeight, fontFamily } = logseq.settings!;
  logseq.provideStyle(`
											:root {
											  font-size: ${fontSize.length > 0 ? fontSize : ""}px !important;
											  line-height: ${lineHeight.length > 0 ? lineHeight : ""} !important;
												font-family: ${fontFamily.length > 0 ? fontFamily : ""} !important;
											}
											`);
}

function main() {
  console.log("logseq-randomutils-plugin loaded");

  provideStyle();
  logseq.onSettingsChanged(function () {
    provideStyle();
  });

  logseq.App.registerCommandPalette(
    {
      key: "Open_block_in_right_sidebar",
      label: "Open block in right sidebar",
      keybinding: {
        binding: "ctrl+shift+o",
      },
    },
    function (e) {
      logseq.Editor.openInRightSidebar(e.uuid);
    }
  );

  logseq.App.registerCommandPalette(
    {
      key: "Go_to_today",
      label: "Go to today",
      keybinding: {
        binding: "ctrl+shift+t",
      },
    },
    async function () {
      logseq.App.pushState("page", {
        name: getDateForPageWithoutBrackets(
          new Date(),
          (await logseq.App.getUserConfigs()).preferredDateFormat
        ),
      });
    }
  );

  handleClosePopup();
  logseq.App.registerCommandPalette(
    {
      key: "Format_selected_text",
      label: "Format text",
    },
    async function () {
      const selectedBlocks = await logseq.Editor.getSelectedBlocks();
      if (selectedBlocks)
        ReactDOM.createRoot(
          document.getElementById("app") as HTMLElement
        ).render(
          <React.StrictMode>
            <FormatText selectedBlocks={selectedBlocks} />
          </React.StrictMode>
        );
      logseq.showMainUI();
    }
  );
  logseq.App.registerCommandPalette(
    {
      key: "scroll_to_top",
      label: "Scroll to top",
      keybinding: {
        binding: "s t",
      },
    },
    async function () {
      const mainContentContainer = top?.document.getElementById(
        "main-content-container"
      );
      mainContentContainer!.scroll(0, 0);
    }
  );
  logseq.App.registerCommandPalette(
    {
      key: "scroll_to_bottom",
      label: "Scroll to bottom",
      keybinding: {
        binding: "s b",
      },
    },
    async function () {
      const pbt = await logseq.Editor.getCurrentPageBlocksTree();
      if (pbt === null || pbt.length === 0) return;

      const page = await logseq.Editor.getPage(pbt[0].page.id);
      if (!page) return;

      logseq.Editor.scrollToBlockInPage(page.name, pbt[pbt.length - 1].uuid);
    }
  );
  logseq.App.registerCommandPalette(
    {
      key: "google_text",
      label: "Google text",
      keybinding: {
        binding: "ctrl+g",
      },
    },
    async function () {
      const text = top!.window.getSelection()?.toString();
      top!.window.open(`https://www.google.com/search?q=${text}`);
    }
  );
  logseq.App.registerCommandPalette(
    {
      key: "get_dictionary_meaning",
      label: "Get dictionary meaning",
      keybinding: {
        binding: "ctrl+m",
      },
    },
    async function () {
      const text = top!.window.getSelection()?.toString();
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
      );
      let meaningsString = ``;
      for (const m of data[0].meanings) {
        meaningsString += `[:hr][:h3.text-l "${m.partOfSpeech}"][:ul`;
        for (const d of m.definitions) {
          meaningsString += `[:li "${d.definition}"]`;
        }
        meaningsString += `]`;
      }
      logseq.UI.showMsg(
        `[:div.p-2
          [:h1.text-xl "${text}"]
          [:h2 "${data[0].phonetic}"]
					${meaningsString}]`,
        "error"
      );
    }
  );

  logseq.Editor.registerBlockContextMenuItem(
    "Create page from block",
    async function (e) {
      const blk = await logseq.Editor.getBlock(e.uuid, {
        includeChildren: true,
      });
      const page = await logseq.Editor.createPage(
        blk!.content.replace("collapsed:: true", ""),
        {},
        {
          redirect: true,
          createFirstBlock: true,
        }
      );
      await logseq.Editor.insertBatchBlock(
        page!.uuid,
        blk!.children as IBatchBlock[]
      );
      await logseq.Editor.updateBlock(
        e.uuid,
        `[[${blk!.content.replace("collapsed:: true", "")}]]`
      );
      await logseq.Editor.insertBlock(e.uuid, `[[${page?.name}]]`, {
        sibling: true,
        before: false,
      });
      await logseq.Editor.removeBlock(e.uuid);
    }
  );
}

const settings: SettingSchemaDesc[] = [
  {
    key: "heading",
    type: "heading",
    default: "",
    title:
      "These settings change basic CSS for all of Logseq. For specific customisations, please use a theme or modify custom.css",
    description: "",
  },
  {
    key: "fontSize",
    type: "string",
    default: "",
    title: "Font Size",
    description: "Sets the default font-size (in pixels)",
  },
  {
    key: "lineHeight",
    type: "string",
    default: "",
    title: "Line Height",
    description: "Sets the default line-height",
  },
  {
    key: "fontFamily",
    type: "string",
    default: "",
    title: "Font Family",
    description:
      'Sets the default font-family. Use inverted commas if your font has more than 1 word, e.g. "Times New Roman"',
  },
];

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
