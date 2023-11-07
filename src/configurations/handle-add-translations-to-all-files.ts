import { Configuration } from "../helpers/configuration";

export function getAddTranslationsToAllFiles() {
  return Configuration.get<boolean>("addTranslationsToAllFiles");
}
export function setAddTranslationsToAllFiles(value: boolean) {
  Configuration.set("addTranslationsToAllFiles", value);
}
