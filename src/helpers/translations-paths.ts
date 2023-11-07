import * as vscode from "vscode";
import * as fs from "fs";
import { Message } from "../feedback/messages";
import { getDefaultLocalizationFileName } from "../configurations/handle-default-localization-file";

export default async function getTranslationsPathFromSelectedFile(
  context: vscode.ExtensionContext
) {
  const editor = vscode.window.activeTextEditor;
  const localization = await getDefaultLocalizationFileName(context);

  if (editor) {
    const document = editor.document;

    const filePath = document.fileName;

    const translationsPath = getTranslationsPathFromCurrentDirectory(filePath);

    if (!translationsPath) {
      return;
    }

    return translationsPath + `/${localization}`;
  } else {
    Message.error("No active text editor found.");
    return undefined;
  }
}

export function getTranslationsPathFromCurrentDirectory(path: string) {
  const paths = path.split("/");
  const rootProjectFolder = paths.findIndex((e) => e === "app");

  if (rootProjectFolder === -1) {
    Message.error(
      `Could not find "translations" folder. Is this an Ember project?`
    );
    return undefined;
  }
  const translationsPath =
    paths.slice(0, rootProjectFolder).join("/") + "/translations";

  return translationsPath;
}

export function getAllLocalizationFilesPaths() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;

    const filePath = document.fileName;

    const translationsPath = getTranslationsPathFromCurrentDirectory(filePath);

    if (!translationsPath) {
      throw new Error("Found no localization files in /translations");
    }

    try {
      const files = fs.readdirSync(translationsPath);

      const ymlFiles = files.filter((file) => file.endsWith(".yml"));

      return ymlFiles.map((file) => translationsPath + "/" + file);
    } catch (error: any) {
      Message.error(`Error reading directory: ${error.message}`);
    }
  } else {
    throw new Error(
      "You need to have a .hbs file open in your Emberjs project."
    );
  }
}

export function getFileNameFromPath(path: string) {
  return path.split("/").at(-1);
}
