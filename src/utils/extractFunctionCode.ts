// utils/extractFunction.ts
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * Reads a .ts file in your functions folder and returns the
 * full text of the named top‐level function declaration,
 * including its TypeScript signature and body.
 */
export function extractFunctionCode(
    fileName: string,
    fnName: string
): string {
    const fullPath = path.join(__dirname, '..', 'functions', fileName);
    const sourceText = fs.readFileSync(fullPath, 'utf-8');

    // Create a TS SourceFile AST
    const sourceFile = ts.createSourceFile(
        fileName,
        sourceText,
        ts.ScriptTarget.Latest,
        /*setParentNodes*/ true
    );

    let extracted = '';

    // Walk the AST looking for a function declaration named fnName
    function visit(node: ts.Node) {
        if (
            ts.isFunctionDeclaration(node) &&
            node.name?.text === fnName
        ) {
            // capture the exact text (including comments & types)
            extracted = sourceText.slice(node.getFullStart(), node.end);
            return;
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);

    if (!extracted) {
        throw new Error(
            `Could not extract function ${fnName} from ${fileName}`
        );
    }
    return extracted.trim();
}
