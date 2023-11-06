import * as vscode from "vscode";
import { resetSelectedTranslatedFile } from "../helpers/handle-select-translation-file";

export default function registerResetTranslationFileCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-gen.resetTranslationFile",
    async () => {
      await resetSelectedTranslatedFile(context);
    }
  );

  context.subscriptions.push(disposable);
}
