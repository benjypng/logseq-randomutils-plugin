import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import handleClosePopup from "./handlePopup";
import { openBlockInSideBar } from "./features/open-block-in-sidebar";
import { scrollBottom, scrollTop } from "./features/scroll";
import { dictionaryText, googleText } from "./features/google-dictionary";
import { addBlockBottom, createPageFromBlock } from "./features/create-blocks";
import { goToday } from "./features/navigation";

import FormatText from "./components/FormatText";
import { createRoot } from "react-dom/client";
import { sortBlocksOnPage } from "./features/sort-blocks-on-page";

const provideStyle = () => {
  const { fontSize, lineHeight, fontFamily } = logseq.settings!;
  logseq.provideStyle(`
		:root {
    	font-size: ${fontSize.length > 0 ? fontSize : ""}px !important;
      line-height: ${lineHeight.length > 0 ? lineHeight : ""} !important;
      font-family: ${fontFamily.length > 0 ? fontFamily : ""} !important;
    }`);
};

function main() {
  console.log("logseq-randomutils-plugin loaded");

  provideStyle();
  handleClosePopup();

  logseq.onSettingsChanged(function () {
    provideStyle();
  });

  openBlockInSideBar();
  scrollTop();
  scrollBottom();
  googleText();
  dictionaryText();
  addBlockBottom();
  createPageFromBlock();
  goToday();
  sortBlocksOnPage();

  logseq.App.registerCommandPalette(
    {
      key: "Format_selected_text",
      label: "Format text",
    },
    async function () {
      const selectedBlocks = await logseq.Editor.getSelectedBlocks();
      if (selectedBlocks) {
        const container = document.getElementById("app");
        const root = createRoot(container!);
        root.render(<FormatText selectedBlocks={selectedBlocks} />);
        logseq.showMainUI();
      }
    },
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
    default: "Arial",
    title: "Font Family",
    description:
      'Sets the default font-family. Use inverted commas if your font has more than 1 word, e.g. "Times New Roman"',
  },
];

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
