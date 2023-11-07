import * as vscode from "vscode";
import { Configuration } from "../helpers/configuration";

export function setDefaultLocalizationFile(localization: string) {
  Configuration.set("defaultLocalizationFile", localization);
}

export async function getDefaultLocalizationFileName(
  context: vscode.ExtensionContext
): Promise<string> {
  const localization = getLocalizationConfig();

  if (!localization) {
    await vscode.commands.executeCommand(
      "ember-intl-tools.setDefaultLocalizationFile"
    );

    return getLocalizationConfig() as string;
  } else {
    return localization;
  }
}

export const getLocalizationConfig = () =>
  Configuration.get<string>("defaultLocalizationFile");
