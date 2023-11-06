import * as vscode from "vscode";

export default function registerGoToTranslationCodelens(
  context: vscode.ExtensionContext
) {
  vscode.languages.registerCodeLensProvider("handlebars", {
    provideCodeLenses(document, token) {
      const codeLenses = [];
      const text = document.getText();

      // Regular expression to match the pattern {{t "your-translation"}}
      const regex = /{{t "(.*)"}}/g;
      let match;

      while ((match = regex.exec(text))) {
        const translationString = match[1];
        const range = new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + match[0].length)
        );

        // Create a CodeLens for each match
        const goToTranslation = new vscode.CodeLens(range);
        goToTranslation.command = {
          title: `Intl: Go to`,
          command: "ember-intl-gen.goToTranslation",
          arguments: [translationString],
        };

        const copyTranslationValue = new vscode.CodeLens(range);
        copyTranslationValue.command = {
          title: `Copy`,
          command: "ember-intl-gen.copyTranslationValue",
          arguments: [translationString],
        };

        codeLenses.push(goToTranslation, copyTranslationValue);
      }

      return codeLenses;
    },
  });
}

function replaceAllChars(text: string, symbol: string = "#") {
  return text.replace(/./g, symbol);
}
