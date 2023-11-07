import * as vscode from "vscode";
import { setDefaultLocalizationFile } from "../helpers/handle-default-localization-file";
import { Message } from "../feedback/messages";

export default function registerSetDefaultLocalizationFileCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.setDefaultLocalizationFile",
    async () => {
      const response = await vscode.window.showInformationMessage(
        "Set default localization file to use",
        { modal: true },
        "Norwegian (nb-no)",
        "English (en-us)",
        "Reset to default",
        "Unset"
      );
      if (!response) {
        return Message.info("No changes made");
      }

      if (response === "Norwegian (nb-no)") {
        setDefaultLocalizationFile("nb-no.yml", context);
      }

      if (response === "English (en-us)") {
        setDefaultLocalizationFile("en-us.yml", context);
      }

      if (response === "Reset to default") {
        setDefaultLocalizationFile("nb-no.yml", context);
      }

      if (response === "Unset") {
        setDefaultLocalizationFile(undefined, context);
      }
    }
  );

  context.subscriptions.push(disposable);
}
