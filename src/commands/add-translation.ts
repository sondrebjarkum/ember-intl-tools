import * as vscode from "vscode";
import { updateTranslationsFile } from "../helpers/update-translations";
import getTranslationsPathFromSelectedFile from "../helpers/get-translations-path";

export default function registerAddTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-gen.addTranslation",
    async () => {
      // let chosenPath = await handleSelectTranslationFile(context, true);
      const chosenPath = await getTranslationsPathFromSelectedFile(context);

      if (!chosenPath) {
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const translationValue = editor.document.getText(selection);

        const translationKey = await vscode.window.showInputBox({
          placeHolder: "Enter translation key",
          prompt: "Enter a translation key for the selected text",
        });

        if (!translationKey) {
          return;
        }

        if (translationKey && translationValue) {
          if (chosenPath) {
            try {
              updateTranslationsFile(
                chosenPath,
                translationKey,
                translationValue
              );
              editor.edit((editBuilder) => {
                editBuilder.replace(selection, `{{t '${translationKey}'}}`);
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
