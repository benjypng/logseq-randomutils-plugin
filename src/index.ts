import "@logseq/libs";
import { getDateForPageWithoutBrackets } from "logseq-dateutils";

function main() {
  console.log("logseq-randomutils-plugin loaded");

  logseq.App.registerCommandPalette(
    {
      key: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, ""),
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
      key: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, ""),
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
}

logseq.ready(main).catch(console.error);
