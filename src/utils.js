import { MIME_TYPES } from './constants'
import { saveAs } from 'file-saver'

export const saveAsExcel = (workbook, filename = 'table', ext = 'xlsx') => {
	const type = MIME_TYPES[ext]

	if (!type) {
		console.error(`${ext} file extension is not supported`)
		return
	}

	workbook.xlsx.writeBuffer().then(uint8 => {
		saveAs(
      new Blob([uint8.buffer], { type }),
      `${filename}.${ext}`
    )
	})
}

const letter = num => {
	const a = 'A'.charCodeAt(0)
	return String.fromCharCode(a + num - 1)
}

/**
 * 0 => A
 * 25 => Z
 * 26 => AA
 */
export const columnIndex = num => {
	let result
	num = num + 1

	if (num <= 26) {
		result = letter(num)
	} else {
		const mod = num % 26
		const quotient = Math.floor(num / 26)

		if (mod === 0) {
			result = letter(quotient - 1) + letter(26)
		} else {
			result = letter(quotient) + letter(mod)
		}
	}
	return result
}

// x = 0, y = 0 => 'A1'
// x = 0, y = 1 => 'A2'
// x = 1, y = 0 => 'B1'
export const cellPosition = (x, y) => {
  return `${columnIndex(x)}${y + 1}`
}

export const mergeCells = (sheet, x1, y1, x2, y2) => {
  const fromCell = cellPosition(x1, y1)
  const toCell = cellPosition(x2, y2)
  sheet.mergeCells(fromCell, toCell)
  return sheet.getCell(fromCell)
}