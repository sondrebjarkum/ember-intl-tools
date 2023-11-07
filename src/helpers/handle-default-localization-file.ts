import * as vscode from "vscode";

export function setDefaultLocalizationFile(
  localization: string | undefined,
  context: vscode.ExtensionContext
) {
  context.globalState.update("defaultLocalizationFile", localization);
}

export async function getDefaultLocalizationFileName(
  context: vscode.ExtensionContext
): Promise<string> {
  const localization = getLocalizationState(context);

  if (!localization) {
    await vscode.commands.executeCommand(
      "ember-intl-tools.setDefaultLocalizationFile"
    );

    return getLocalizationState(context) as string;
  } else {
    return localization;
  }
}

const getLocalizationState = (context: vscode.ExtensionContext) =>
  context.globalState.get<string | undefined>("defaultLocalizationFile");
