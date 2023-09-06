export const addBlockBottom = () => {
  logseq.App.registerCommandPalette(
    {
      key: "add_block_to_bottom",
      label: "Add block to bottom of page",
      keybinding: {
        binding: "a b",
      },
    },
    async function () {
      const blk = await logseq.Editor.getCurrentBlock();
      if (!blk) return;

      const pg = await logseq.Editor.getPage(blk.page.id);
      if (!pg) return;

      const pbt = await logseq.Editor.getPageBlocksTree(pg.name);
      if (pbt === null || pbt.length === 0) return;

      await logseq.Editor.insertBlock(pbt[pbt.length - 1]!.uuid, "", {
        sibling: true,
        before: false,
      });
    },
  );
};

export const createPageFromBlock = () => {
  logseq.Editor.registerBlockContextMenuItem(
    "Create page from block",
    async function (e) {
      const blk = await logseq.Editor.getBlock(e.uuid, {
        includeChildren: true,
      });
      if (!blk) return;
      const { content, children } = blk;

      if (
        !content.includes("[") &&
        !content.includes("](") &&
        !content.includes(")")
      ) {
        const page = await logseq.Editor.createPage(
          blk.content.replace("collapsed:: true", ""),
          {},
          {
            redirect: true,
            createFirstBlock: true,
          },
        );
        if (!page) return;

        //@ts-expect-error
        await logseq.Editor.insertBatchBlock(page.uuid, children!);
        await logseq.Editor.updateBlock(
          e.uuid,
          `[[${blk!.content.replace("collapsed:: true", "")}]]`,
        );
        await logseq.Editor.insertBlock(e.uuid, `[[${page.name}]]`, {
          sibling: true,
          before: false,
        });
        await logseq.Editor.removeBlock(e.uuid);
      } else {
        // TODO:Create new page with link title as page name and remaining text in the block
        // Regex content inside link description
      }
    },
  );
};
