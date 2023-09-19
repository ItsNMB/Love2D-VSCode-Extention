'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LUA_MODE } from './luaMode';
import { getSuggestions } from './loveAutocomplete'
import { LoveSignatureHelpProvider } from './loveFuncitonSuggestions';

export const EXT_TAG = "Love2D";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "love2d for vscode" is now active!');
    // Setup our plugin to help with function signatures
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(LUA_MODE, new LoveSignatureHelpProvider(vscode.workspace.getConfiguration('lua')['docsTool']), '(', ','));
    
    let completionItemProvider = {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.CompletionItem[] {

            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);

            let wordAtPosition = document.getWordRangeAtPosition(position);
            let currentWord = '';
            if (wordAtPosition && wordAtPosition.start.character < position.character) {
                let word = document.getText(wordAtPosition);
                currentWord = word.substr(0, position.character - wordAtPosition.start.character);
            }

            // Check if we don't have any '.'s in the line and the letter starts with 'l'
            // If so, return love as a suggestions
            var count = (lineText.match(/\./g) || []).length;
            if (count == 0 && currentWord == "l") {
                let suggestion: vscode.CompletionItem = new vscode.CompletionItem("love", vscode.CompletionItemKind.Module);
                suggestion.detail = EXT_TAG;
                suggestion.documentation = "LOVE 2D Game Framework";
                return [suggestion];
            }

            // Check through the list of functions that are included in this file and see if any match
            // the starting letter of the word we have so far
            let suggestions: vscode.CompletionItem[] = getSuggestions(lineText, currentWord);

            return suggestions;

        }
    };

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(LUA_MODE, completionItemProvider, '.'));

    // Register command to launch love
    var launch = vscode.commands.registerCommand('LOVE.launch', () => {
        runInTerminal("lovec .");
    });
    context.subscriptions.push(launch);

    // Register command to launch love with debugging logs
    var launchwithdebuglog = vscode.commands.registerCommand('LOVE.launchwithdebuglog', () => {
        runInTerminal("lovec . --debuglog");
    });
    context.subscriptions.push(launchwithdebuglog);

}

function runInTerminal(command: string) {
    // check if any terminals are open
    let terminal = vscode.window.terminals[0];
    if (terminal) {
        // if so, get the active terminal
        let activeTerminal = vscode.window.activeTerminal;
        if (activeTerminal) {
            // if there is an active terminal, run the command in that terminal
            activeTerminal.sendText(command, true);
        } else {
            // if not, create a new terminal
            terminal = vscode.window.createTerminal();
            terminal.sendText(command, true);
        }
    } else {
        // if not, create a new terminal
        terminal = vscode.window.createTerminal();
        terminal.sendText(command, true);
    }
}

// Get the full function call based on where the cursor is
function getFunctionCall(lineNum: number, cursorPosition: number) {
    let line = vscode.window.activeTextEditor.document.lineAt(lineNum);
    let lineText = line.text;
    let characterLimit = line.range.end.character;

    let functionCall = lineText.charAt(cursorPosition);
    let newPos = cursorPosition - 1;
    // Iterate from the cursor position to the beginning of the line or a whitespace character
    while (true) {
        if (newPos < 0) {
            // We've reached the beginning of the line so break
            break;
        }
        let newChar = lineText.charAt(newPos);
        let done = false;
        switch (newChar) {
            case ' ':
                done = true;
                break;
            case '\t':
                done = true;
                break;
            default:
                functionCall = newChar + functionCall
                break;
        }
        newPos -= 1;

        if (done) { break; }
    }

    // Iterate from the cursor until the end of line or when a '(' is hit
    newPos = cursorPosition + 1;
    while (true) {
        if (newPos > characterLimit) {
            // We've reached the end of the line so break
            break;
        }
        let newChar = lineText.charAt(newPos);
        let done = false;
        switch (newChar) {
            case ' ':
                done = true;
                break;
            case '(':
                done = true;
                break;
            case '\t':
                done = true;
                break;
            default:
                functionCall = functionCall + newChar;
                break;
        }
        newPos += 1;

        if (done) { break; }
    }

    return functionCall;
}

// this method is called when your extension is deactivated
export function deactivate() {
}
