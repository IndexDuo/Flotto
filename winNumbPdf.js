import fs from 'fs'
import cheerio from 'cheerio'

// Read the HTML content from the file
const htmlContent = fs.readFileSync('dataPDF/winningNumber.htm', 'utf8')

// Parse the HTML content with cheerio
const $ = cheerio.load(htmlContent)

const winningNumbers = []

$('td[width="47"]').each((i, dateTd) => {
  let drawDate = ''
  const date = $(dateTd).text().trim()
  if (!date.match(/\d{2}\/\d{2}\/\d{2}/)) {
    return // Skip this td tag if it doesn't contain a date
  }

  drawDate = date

  let tdTag = $(dateTd).next()
  let currentNumbers = []
  while (
    tdTag.length &&
    !(tdTag.attr('width') === '131' && tdTag.attr('rowspan') === '2') &&
    currentNumbers.length < 6
  ) {
    const number = tdTag.find('font').text().trim()
    if (number.match(/\d/)) {
      currentNumbers.push(number)
    }
    tdTag = tdTag.next()
  }

  if (currentNumbers.length === 6) {
    // Find the td tag that contains the play type
    while (tdTag.length && !(tdTag.attr('width') === '131')) {
      tdTag = tdTag.next()
    }

    // If the td tag is found, store the play type in currentType
    if (tdTag.length) {
      const currentType = tdTag.find('font').text().trim()
      // Push the drawDate, currentNumbers, and currentType to the winningNumbers array as an object
      winningNumbers.push({
        date: drawDate,
        numbers: currentNumbers,
        type: currentType,
      })
    }
  }
})

// Wrap the winningNumbers array in an object
const result = { winningNumbers }

// All lines have been processed
// You can now work with the `result` object or perform further actions
console.log(result)

// If you want to write the result to a JSON file
fs.writeFile('winningNumbers.json', JSON.stringify(result), (err) => {
  if (err) throw err
  console.log('Result saved to winningNumbers.json')
})
