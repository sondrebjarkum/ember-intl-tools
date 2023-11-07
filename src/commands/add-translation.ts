import * as vscode from "vscode";
import { updateTranslationsFile } from "../helpers/update-translations";
import getTranslationsPathFromSelectedFile from "../helpers/get-translations-path";
import { Message } from "../feedback/messages";

export default function registerAddTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.addTranslation",
    async () => {
      // let chosenPath = await handleSelectTranslationFile(context, true);
      const chosenPath = await getTranslationsPathFromSelectedFile(context);

      if (!chosenPath) {
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        let translationValue = editor.document.getText(selection);

        if (translationValue == "") {
          const translation = await vscode.window.showInputBox({
            placeHolder: "Enter translation sentence",
            prompt: "No selected text, write out your translation",
          });

          if (!translation) {
            return;
          }

          translationValue = translation;
        }

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
              await updateTranslationsFile(
                chosenPath,
                translationKey,
                translationValue
              );

              editor.edit((editBuilder) => {
                editBuilder.replace(selection, `{{t '${translationKey}'}}`);
              });
            } catch (error) {
              const err = error as any;
              return Message.info(err.message);
            }
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
