# Flotto

## Table of Contents

- [General Info](#general-info)
- [Technologies](#technologies)
- [Installation](#how-to-install)

## General Info

Using Florida Lottery data to help you choose your next numbers

### Features

- Test your chances by inputing numbers into the form
- See a map of cities with the most winners
- See a list of the most common winning numbers

## Technologies

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## How to Install

1. clone this repo to your vscode
2. do npm i in your terminal
3. very very important!!
   after you do npm i, be sure to go to your node_modules\pdf-parse\index.js
   and change let isDebugMode = !module.parent; to let isDebugMode = false;
4. run the main js file

```
node lotteryApi.js
```

5. In a seperate terminal run

```
npx tailwindcss -i ./style.css -o ./dist/output.css --watch
```

6. open localhost:3000 in your browser
