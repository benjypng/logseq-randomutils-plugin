import { getDateForPageWithoutBrackets } from "logseq-dateutils";

export const goToday = () => {
  logseq.App.registerCommandPalette(
    {
      key: "Go_to_today",
      label: "Go to today",
      keybinding: {
        binding: "ctrl+shift+t",
      },
    },
    async () => {
      logseq.App.pushState("page", {
        name: getDateForPageWithoutBrackets(
          new Date(),
          (await logseq.App.getUserConfigs()).preferredDateFormat
        ),
      });
    }
  );
};
