import * as fs from "fs";
import * as path from "path";

export const assertFullyQualifiedPath = (filePath: string): string => {
  if (path.isAbsolute(filePath)) {
    const fileAsString = fs.readFileSync(filePath, "utf8");

    return fileAsString;
  }

  throw new Error(
    `Expected "${filePath}" to be a fully-qualified path not a relative path.`
  );
};
