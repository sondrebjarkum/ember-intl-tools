import * as vscode from "vscode";

export default async function handleSelectTranslationFile(
  context: vscode.ExtensionContext,
  skipExistingPathCheck = false
) {
  let chosenPath = context.globalState.get("chosenPath") as string | undefined;

  // if (skipExistingPathCheck && chosenPath) {
  //   return chosenPath;
  // }

  if (chosenPath) {
    const usePreviousPath = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: `Use the previous path: ${chosenPath}?`,
    });

    if (usePreviousPath === "No") {
      chosenPath = undefined;
    }
    if (usePreviousPath === "Yes") {
      return chosenPath;
    }
  }

  if (!chosenPath) {
    const fileUris = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Select Translation File",
    });

    if (!fileUris) {
      throw new Error("No translation file chosen!");
    }
    const path = fileUris[0].fsPath;
    context.globalState.update("chosenPath", path);
    return fileUris[0].fsPath;
  }
}

export async function resetSelectedTranslatedFile(
  context: vscode.ExtensionContext
) {
  const response = await vscode.window.showWarningMessage(
    "Are you sure you want to reset the translations file path?",
    { modal: true },
    "Yes",
    "No"
  );

  if (response === "Yes") {
    context.globalState.update("chosenPath", undefined);
  }
}

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
