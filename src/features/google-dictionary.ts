import axios from "axios";

export const googleText = () => {
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
};

export const dictionaryText = () => {
  logseq.App.registerCommandPalette(
    {
      key: "get_dictionary_meaning",
      label: "Get dictionary meaning",
      keybinding: {
        binding: "ctrl+shift+m",
      },
    },
    async function () {
      const text = top?.window.getSelection()?.toString();
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
        "success",
        { timeout: 600000 }
      );
    }
  );
};
