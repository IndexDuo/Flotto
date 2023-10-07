# KnightHacks2023

## Getting Started

1. clone this repo to your vscode
2. do  npm i in your terminal
3. to run the .js files,  do node "file-name"

very very important!!
after you do npm i, be sure to go to your node_modules\pdf-parse\index.js
and change let isDebugMode = !module.parent; to let isDebugMode = false;

### What's each file for?

#### pdf.js

This .js file turns the **lottowinners_floridalotto.pdf** to raw data and then do some regex stuff to make it prettier.
 
The result is updated in the **pdfoutput.txt** file.

Every time you do **node pdf.js** in you terminal, **pdfoutput.txt** will be updated.


## How to push my code so it's in the main branch

do "git push origin main"

## How to pull the code from another branch so i have the most up-to-date code?

do "git pull -branch name here-"

