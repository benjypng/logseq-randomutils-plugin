import "@logseq/libs";

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
}

logseq.ready(main).catch(console.error);
