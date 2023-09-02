export const openBlockInSideBar = () => {
  logseq.App.registerCommandPalette(
    {
      key: "Open_block_in_right_sidebar",
      label: "Open block in right sidebar",
      keybinding: {
        binding: "ctrl+shift+o",
      },
    },
    function (ev) {
      logseq.Editor.openInRightSidebar(ev.uuid);
    }
  );
};
