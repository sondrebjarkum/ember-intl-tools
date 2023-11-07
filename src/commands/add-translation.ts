import * as vscode from "vscode";
import {
  updateMultipleTranslationFiles,
  updateTranslationsFile,
} from "../helpers/update-translations";
import getTranslationsPathFromSelectedFile, {
  getAllLocalizationFilesPaths,
} from "../helpers/translations-paths";
import { Message } from "../feedback/messages";
import { Configuration } from "../helpers/configuration";

export default function registerAddTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.addTranslation",
    async () => {
      const chosenPath = await getTranslationsPathFromSelectedFile(context);

      if (!chosenPath) {
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        let translationValue = editor.document.getText(selection);

        if (translationValue === "") {
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

        if (translationKey && translationValue && chosenPath) {
          const addTranslationToAllFiles = Configuration.get<boolean>(
            "addTranslationsToAllFiles"
          );

          if (addTranslationToAllFiles) {
            const allFilesPaths = getAllLocalizationFilesPaths();
            if (allFilesPaths) {
              updateMultipleTranslationFiles(
                allFilesPaths,
                translationKey,
                translationValue,
                context
              );
            }
          } else {
            await updateTranslationsFile(
              chosenPath,
              translationKey,
              translationValue,
              context
            );
          }

          editor.edit((editBuilder) => {
            editBuilder.replace(editor.selection, `{{t '${translationKey}'}}`);
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
