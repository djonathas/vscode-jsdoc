import * as vscode from 'vscode'
import { getFormatDate } from './date'

export const genJSDoc = () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }

  const selection = editor.selection
  const selectionText = editor.document.getText(selection)
  const getParamReg = /\(([^)]*)\)/
  const m = selectionText.match(getParamReg)

  if (!m) {
    return
  }
  const paramList = m[1].replace(/[\t\s\r]/g, '').split(',').filter(s => s !== '')

  editor.edit(editBuilder => {
    const selectionLine = editor.document.lineAt(selection.start.line)
    const insertPosition = selectionLine.range.start
    const configuration = vscode.workspace.getConfiguration('jsdoc')
    const author: string = configuration.get('author', '')
    const hasDate: boolean = configuration.get('insertDate', false)

    let text = '/**\r'
    text += `* Describe your function\r`

    if (author)
      text += `* @author ${author}\r`

    if (hasDate)
      text += `* @date ${getFormatDate('YYYY-MM-DD', new Date())}\r`

    paramList.forEach(param => {
      const paramName = param.replace(/:\s?(.*)/g, '')
      const paramType = param.match(/:\s?(.*)/g)
      const paramTypeString = paramType && paramType.length > 1 ? paramType[1] : 'any'
      text += `* @param {${paramTypeString}} ${paramName}\r`
    })

    text += `* @return {any}\r`
    text += `*/\r`

    const whitespace = selectionLine.firstNonWhitespaceCharacterIndex
    const padSpaceStr = ' '.repeat(whitespace)

    text = text.replace(/\r/g, `\r${padSpaceStr} `)
    text = `${padSpaceStr}${text}`
    text = text.slice(0, text.length - whitespace - 1)

    editBuilder.insert(insertPosition, text)
  })
}