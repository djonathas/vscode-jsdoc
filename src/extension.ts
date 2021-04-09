import * as vscode from 'vscode'
import { generateJSDoc } from './main'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.generateJSDoc',
    generateJSDoc
  )

  context.subscriptions.push(disposable)
}

export function deactivate() { }
