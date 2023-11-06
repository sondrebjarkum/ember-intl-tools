import * as vscode from "vscode";
import handleSelectTranslationFile from "../helpers/handle-select-translation-file";

export default function registerSetTranslationFileCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-gen.setTranslationFile",
    async () => {
      await handleSelectTranslationFile(context);
    }
  );

  context.subscriptions.push(disposable);
}
