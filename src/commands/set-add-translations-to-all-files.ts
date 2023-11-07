import * as vscode from "vscode";
import { Message } from "../feedback/messages";
import { setAddTranslationsToAllFiles } from "../configurations/handle-add-translations-to-all-files";

export default function registerSetAddTranslationsToAllFilesCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.setAddTranslationsToAllFiles",
    async () => {
      const response = await vscode.window.showInformationMessage(
        "Add translation to all localization files?",
        { modal: true },
        "Yes",
        "No"
      );

      if (!response) {
        Message.info("No changes made");
        return;
      }

      if (response === "Yes") {
        setAddTranslationsToAllFiles(true);
      }
      if (response === "No") {
        setAddTranslationsToAllFiles(false);
      }

      Message.info("Updated settings");
    }
  );

  context.subscriptions.push(disposable);
}
