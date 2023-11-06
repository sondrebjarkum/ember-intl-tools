import * as vscode from "vscode";

export function setDefaultLocalizationFile(
  localization: string | undefined,
  context: vscode.ExtensionContext
) {
  context.globalState.update("defaultLocalizationFile", localization);
}

export async function getDefaultLocalizationFileName(
  context: vscode.ExtensionContext
) {
  const localization = context.globalState.get<string | undefined>(
    "defaultLocalizationFile"
  );

  if (!localization) {
    await vscode.commands.executeCommand(
      "ember-intl-gen.setDefaultLocalizationFile"
    );

    return await getDefaultLocalizationFileName(context);
  } else {
    return localization;
  }
}
