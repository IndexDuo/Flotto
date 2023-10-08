# Flotto

## Table of Contents

- [General Info](#general-info)
- [Technologies](#technologies)

## General Info

Using Florida Lottery data to help you choose your next numbers

### Features

- Test your chances
- See a map of cities with the most winners
- See a list of the most common winning numbers

## Technologies

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## Getting Started

1. clone this repo to your vscode
2. do npm i in your terminal
3. to run the .js files, do node "file-name"

very very important!!
after you do npm i, be sure to go to your node_modules\pdf-parse\index.js
and change let isDebugMode = !module.parent; to let isDebugMode = false;

use "npx tailwindcss -i ./style.css -o ./dist/output.css --watch" for tailwind

### What's each file for?

#### pdf.js

This .js file turns the **lottowinners_floridalotto.pdf** to raw data and then do some regex stuff to make it prettier.

The result is updated in the **pdfoutput.txt** file.

Every time you do **node pdf.js** in you terminal, **pdfoutput.txt** will be updated.

## How to push my code so it's in the main branch

do "git push origin main"

## How to pull the code from another branch so i have the most up-to-date code?

do "git pull -branch name here-"
