import * as vscode from "vscode";
import { Message } from "../feedback/messages";
import { getDefaultLocalizationFileName } from "./handle-default-localization-file";

export const TranslationsFileName = "nb-no.yml";

export default async function getTranslationsPathFromSelectedFile(
  context: vscode.ExtensionContext
) {
  const editor = vscode.window.activeTextEditor;
  const localization = await getDefaultLocalizationFileName(context);

  if (editor) {
    // Get the document associated with the editor
    const document = editor.document;

    // Get the file path of the document
    const filePath = document.fileName;

    const paths = filePath.split("/");
    const rootProjectFolder = paths.findIndex((e) => e === "app");

    if (rootProjectFolder === -1) {
      Message.error(
        `Could not find "translations" folder. Is this an Ember project?`
      );
      return undefined;
    }

    const translationsPath =
      paths.slice(0, rootProjectFolder).join("/") + "/translations";

    return translationsPath + `/${localization}`;
  } else {
    Message.error("No active text editor found.");
    return undefined;
  }
}
