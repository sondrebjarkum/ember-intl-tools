import * as vscode from "vscode";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { Message } from "../feedback/messages";
import { getFileNameFromPath } from "./translations-paths";

const cleanup = (context: vscode.ExtensionContext) => {
  context.globalState.update("yesToAllRewrites", false);
};

export async function updateMultipleTranslationFiles(
  filePaths: string[],
  translationKey: string,
  translationValue: string,
  context: vscode.ExtensionContext
) {
  try {
    for (const path of filePaths) {
      await updateTranslationsFile(
        path,
        translationKey,
        translationValue,
        context
      );
    }
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    cleanup(context);
  }
}

export async function updateTranslationsFile(
  filePath: string,
  translationKey: string,
  translationValue: string,
  context: vscode.ExtensionContext
) {
  try {
    // Read the existing YAML content
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContent) as any;

    // Split the translation key by "." to create a nested structure
    const keys = translationKey.split(".");
    let currentLevel = data;

    // Traverse the nested structure and create missing paths
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentLevel[key]) {
        currentLevel[key] = {};
      }
      currentLevel = currentLevel[key];
    }

    if (currentLevel[keys[keys.length - 1]]) {
      const yesToAllRewrites =
        context.globalState.get<boolean>("yesToAllRewrites");

      if (!yesToAllRewrites) {
        const response = await vscode.window.showInformationMessage(
          `Overwrite existing translation in ${getFileNameFromPath(filePath)}?`,
          { modal: true },
          "Yes",
          "No",
          "Yes to all rewrites"
        );

        if (!response || response === "No") {
          return;
        }

        if (response === "Yes to all rewrites") {
          await context.globalState.update("yesToAllRewrites", true);
        }
      }
    }

    // Set the translation value at the final key
    currentLevel[keys[keys.length - 1]] = translationValue;

    // Convert the updated data back to YAML
    const updatedYAML = yaml.dump(data, {
      noRefs: true, // Prevent replacing duplicate references,
      forceQuotes: true,
      quotingType: '"',
    });

    // Write the updated YAML back to the file
    fs.writeFileSync(filePath, updatedYAML, "utf8");
  } catch (error: any) {
    Message.error(`Error updating YAML file: ${error.message}`);
    throw new Error(error.message);
  }
}
