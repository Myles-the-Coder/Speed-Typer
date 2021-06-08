const wordEl = document.getElementById('word')
const textInput = document.getElementById('text')
const scoreEl = document.getElementById('score')
const timeEl = document.getElementById('time')
const endgameEl = document.getElementById('end-game-container')
const settingsForm = document.getElementById('settings-form')
const hideDifBtn = document.getElementById('hide-difficulty')
const difficultySelect = document.getElementById('difficulty-select')
const difficultyContainer = document.getElementById('difficulty-container')

//Init score
let score = 0
//Init time
let time = 10
//Init difficulty to value in ls or medium
let difficulty = setDifficulty()

//Set difficulty select value
difficultySelect.value = setDifficulty()

//Focus on text on start
textInput.focus()

//Start counting down
const timeInterval = setInterval(updateTime, 1000)

//Functions
//Get JSON Data
async function getJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

//Get random word and insert it into the DOM
async function getRandomWord() {
  const data = await getJSON('https://random-words-api.vercel.app/word')
  const {word} = data[0]
  wordEl.innerText = word.toLowerCase()
}

getRandomWord()

//Set difficulty
function setDifficulty() {
  return localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'normal'
}

//Update score
function updateScore() {
  score++
  scoreEl.innerHTML = score
}

//Update time
function updateTime() {
 time--
 timeEl.innerHTML = `${time}s`

 if(time === 0) {
   clearInterval(timeInterval)
   //End game
   gameOver()
 }
}

//Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
  <h1 class="timeout">Time ran out <i class="bi bi-clock"></i></h1>
  <p>Your final score is ${score}</p>
  <button class="btn play-again" id="play-again">Play Again</button>
  `
  endgameEl.style.display = 'flex'

  const playAgain = document.getElementById('play-again')
  playAgain.addEventListener('click', () => window.location.reload())
}

//Hide difficulty container
function hideDifficulty() {
difficultyContainer.classList.toggle('hide')
}

//Event Listeners

//Typing
textInput.addEventListener('input', e => {
  const insertedText = e.target.value

  if(insertedText === wordEl.innerText) {
    getRandomWord()
    updateScore()
    //Clear
    e.target.value = ''

    if(difficulty === 'easy') {
      time += 6
    } else if (difficulty === 'normal') {
      time += 4
    } else {
      time += 3
    }

    updateTime()
  }
})

//Settings form
settingsForm.addEventListener('change', e => {
  difficulty = e.target.value
  localStorage.setItem('difficulty', difficulty)
})

//Settings
hideDifBtn.addEventListener('click', hideDifficulty)
