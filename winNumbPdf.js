import fs from 'fs'
import cheerio from 'cheerio'

// Read the HTML content from the file
const htmlContent = fs.readFileSync('dataPDF/winningNumber.htm', 'utf8')

// Parse the HTML content with cheerio
const $ = cheerio.load(htmlContent)

const winningNumbers = []

let currentType = ''
let currentNumbers = []

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
    while (
      tdTag.length &&
      !(tdTag.attr('width') === '131')
    ) {
      tdTag = tdTag.next()
    }

    // If the td tag is found, store the play type in currentType
    if (tdTag.length) {
      currentType = tdTag.find('font').text().trim()
    }

    // Push the drawDate, currentNumbers, and currentType to the winningNumbers array
    winningNumbers.push({
      date: drawDate,
      numbers: currentNumbers,
      type: currentType,
    })
  }
})



  // if (currentNumbers.length === 6) {
  //   winningNumbers.push({
  //     date: drawDate,
  //     numbers: currentNumbers,
  //   })
  // }

// All lines have been processed
// You can now work with the `winningNumbers` array or perform further actions
console.log(winningNumbers)

// If you want to write the winning numbers to a JSON file
fs.writeFile('winningNumbers.json', JSON.stringify(winningNumbers), (err) => {
  if (err) throw err
  console.log('Winning numbers saved to winningNumbers.json')
})
