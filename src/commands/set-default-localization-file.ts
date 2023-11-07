import * as vscode from "vscode";
import { setDefaultLocalizationFile } from "../configurations/handle-default-localization-file";
import { Message } from "../feedback/messages";

export default function registerSetDefaultLocalizationFileCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.setDefaultLocalizationFile",
    async () => {
      const response = await vscode.window.showInputBox({
        placeHolder: "en-us.yml",
        prompt:
          "Set what localization will be used as default for adding translations",
      });

      if (!response) {
        Message.info("No changes made");
        return;
      }

      if (!response.endsWith(".yml")) {
        throw new Error(
          "The default localization file format must be YAML (.yml)"
        );
      }

      setDefaultLocalizationFile(response);

      Message.info("Updated settings");
    }
  );

  context.subscriptions.push(disposable);
}
