export const scrollTop = () => {
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
        "main-content-container",
      );
      mainContentContainer!.scroll(0, 0);
    },
  );
};

export const scrollBottom = () => {
  logseq.App.registerCommandPalette(
    {
      key: "scroll_to_bottom",
      label: "Scroll to bottom",
      keybinding: {
        binding: "s b",
      },
    },
    async function () {
      const blk = await logseq.Editor.getCurrentBlock();
      if (!blk) return;

      const pg = await logseq.Editor.getPage(blk!.page.id);
      if (!pg) return;

      const pbt = await logseq.Editor.getPageBlocksTree(pg!.name);
      if (pbt === null || pbt.length === 0) return;

      logseq.Editor.scrollToBlockInPage(pg.name, pbt[pbt.length - 1]!.uuid);
    },
  );
};
