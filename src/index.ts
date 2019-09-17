import fs from 'fs';
import url from 'url';
import callsite from 'callsite';

const parseImport = (line: string, filePath: string) => {
  const trimmedLine = line.trim();
  if (!trimmedLine.match(/^# +import/)) {
    return null;
  }

  const matches =
    // Import wrapped with double quotes
    trimmedLine.match(/^# *import +"(.+)" *;?$/) ||
    // Import wrapped with single quotes
    trimmedLine.match(/^# *import +'(.+)' *;?$/);

  if (!matches) {
    // Emit a helpful error for developers
    const error = `
Encountered a malformed import line when importing a GraphQL file ${filePath}:

${trimmedLine}

Supported formats:
#import './some-file-path.graphql'
# import './some-file-path.graphql'
#import "./some-file-path.graphql"
# import "./some-file-path.graphql"`;

    throw new Error(error.trim());
  }

  return matches[1];
};

const importGraphqlFileAbsolute = (
  absoluteFilePath: string,
  filesAlreadyImported: Record<string, boolean>
): string => {
  filesAlreadyImported[absoluteFilePath] = true;

  const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');
  return fileContent
    .split('\n')
    .map(line => {
      const parsedImport = parseImport(line, absoluteFilePath);
      if (!parsedImport) {
        return line;
      }

      const absoluteImportPath = url.resolve(absoluteFilePath, parsedImport);
      const fileAlreadyImported = filesAlreadyImported[absoluteImportPath];
      if (fileAlreadyImported) {
        return '';
      }

      return importGraphqlFileAbsolute(
        absoluteImportPath,
        filesAlreadyImported
      );
    })
    .join('\n');
};

const importGraphqlString = (relativeOrAbsolutePath: string) => {
  const stack = callsite();
  const requester = stack[1].getFileName();

  const absolutePath = url.resolve(requester, relativeOrAbsolutePath);
  return importGraphqlFileAbsolute(absolutePath, {});
};

export default importGraphqlString;
