editor.setValue("Welcome")

let allUsers = [];
let allUserRounds = []
let allRounds = []
let characterList = []
let currentUserArr = []
let currentUser
let currentRound
let currentUserRound
let character
let hint = false

let runText = document.querySelector('#run-text')
let innerText = document.querySelector('#inner-text')
let beforeLogin = document.querySelector('#before-login')
let afterLogin = document.querySelector('#after-login')
let inputUN = document.querySelector('#input-un')
let login = document.querySelector(".login")
let gameGraphics = document.querySelector('#game-graphics')
let hintBtn = document.querySelector('#hint')
let textEditor = document.querySelector('#text-editor')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded')
  fetchUsers()
  fetchUserRounds()
  fetchRounds()
  logInPage()


});
function logInPage(){
  if (login) {
    currentUser = ""
    inputUN.value = ""
    let body = document.querySelector('body')
    body.setAttribute('id', 'pre-login')
    beforeLogin.style.display = 'block'
    afterLogin.style.display = 'none'
    login.addEventListener('submit', findUser)
  }
}

function fetchRounds(){
  fetch ('http://localhost:3000/api/v1/rounds')
  .then(response => response.json())
  .then(myJson => {
    allRounds = myJson
  })
}
function fetchUserRounds(){
  fetch ('http://localhost:3000/api/v1/user_rounds')
  .then(response => response.json())
  .then(myJson => {
    allUserRounds = myJson
  })
}
function fetchUsers(){
  fetch ('http://localhost:3000/api/v1/users')
  .then(response => response.json())
  .then(myJson => {
    allUsers = myJson
  })
}

function createUser(loginInput){
  fetch ('http://localhost:3000/api/v1/users', {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: loginInput,
        score: 0
      }
    })
  })
  .then(response => response.json())
  .then(myJson => {
    currentUser = myJson
    allUsers.push(currentUser)
    createUserRound(currentUser)
    })
}

function findUser(e){
  e.preventDefault()
    if (e.target.querySelector('#char2').checked){
     char = "char2"
    }
    else if (e.target.querySelector('#char3').checked){
     char = "char3"
    }
    else if (e.target.querySelector('#char4').checked){
     char = "char4"
    }
    else if (e.target.querySelector('#char5').checked){
     char = "char5"
    }
    else if (e.target.querySelector('#char6').checked){
     char = "char6"
    }
    else if (e.target.querySelector('#char7').checked){
     char = "char7"
    }
    else if (e.target.querySelector('#char8').checked){
     char = "char8"
    }
    else {
     char = "char1"
    }
    let loginInput = e.target.querySelector('#input-un').value
    currentUser = allUsers.find(user => user.name == loginInput)
    currentUserArr = []
    currentUserArr.push(currentUser)

    if (currentUser == undefined){
      createUser(loginInput)
    }
    currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
    currentRound = allRounds.find(round => round.id == currentUserRound.round_id)
    afterLogin.style.display = 'block'
    beforeLogin.style.display = 'none'
    renderThisGame(currentUser, char)
  }

function createUserRound(currentUser){
  let currentUserId = currentUser.id
  fetch('http://localhost:3000/api/v1/user_rounds', {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      user_round: {
        user_id: currentUserId,
        round_id: 1
      }
    })
  })
  .then(response => response.json())
  .then(myJson => {
    let newUserRound = myJson
    allUserRounds.push(newUserRound)
    renderThisGame(currentUser)

  })
  }

function updateUserRound(currentUserRound, character){
  currentUserRound = allUserRounds.find(userRound => userRound.user_id == currentUser.id)
  if (currentUserRound.round_id == 6) {
    user_id = currentUserRound.user_id
    round_id = 1
  } else if (currentUserRound.round_id != 6){
    user_id = currentUserRound.user_id
    round_id = currentUserRound.round_id + 1
  }
  let data = {
      user_round: {
        user_id: user_id,
        round_id: round_id
    }
  }
  fetch(`http://localhost:3000/api/v1/user_rounds/${currentUserRound.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    if (myJson.round_id == 1) {
      currentUserRound = allUserRounds.find(userRound => userRound.id == myJson.id)
      currentUserRound.round_id = myJson.round_id
      let body = document.querySelector('body')
      body.setAttribute('class', 'game-again')
      document.querySelector('#game-over-txt').remove()
      let currentRound = allRounds.find(round => round.id == currentUserRound.round_id)
      renderLevelOneAgain(currentUser, currentRound)
    } else {
      currentUserRound = allUserRounds.find(userRound => userRound.id == myJson.id)
      currentUserRound.round_id = myJson.round_id
      let currentPosition = parseInt(character.element.style.left);
      character.walkEast(imgURL)
      playdatsound()
    }
  })
}

function renderLevelOneAgain(currentUser, currentRound){
  textEditor.style.display = 'block'
  gameGraphics.innerHTML = `
    <h1 id="level" class="header"> Level ${currentRound.level} </h1>
    <img src='https://uniqueideas.co.uk/wp-content/uploads/2013/09/apple-air.png' id='container'>
      <div id="not-computer">
        <h3 id='username' class="level-text">USERNAME: ${currentUser.name} </h3>
        <h3 id='score' class="level-text">SCORE: ${currentUser.score} </h3>
        <img id="background-image" src= ${currentRound.background_image} style="width:850px;height:500px">
        <h3 id='challenge' class="level-text"> Challenge: ${currentRound.challenge} </h3>
      </div>
    <br>
    `
    characterList = []
    if (char == "char2"){
      imgURL = "https://talenthouse-res.cloudinary.com/image/upload/c_limit,h_1000,w_1000/v1/user-549495/submissions/ianomididwehoyihq6tq.gif"
      character = new Character(imgURL)
    }
    else if  (char == "char3"){
      imgURL = "https://webstockreview.net/images/clipart-woman-superhero-10.png"
      character = new Character(imgURL)
    }
    else if  (char == "char4"){
      imgURL = "https://i.pinimg.com/originals/ef/09/63/ef09630a4f8f8cff7f9bfacf134e476d.png"
      character = new Character(imgURL)
    }
    else if  (char == "char5"){
      imgURL = "https://i.giphy.com/media/YiAgLZcqoPKHHjHael/giphy.webp"
      character = new Character(imgURL)
    }
    else if  (char == "char6"){
      imgURL = "http://www.secondcapemaybaptist.church/wp-content/uploads/2018/07/Flying-SuperGirl-4.png"
      character = new Character(imgURL)
    }
    else if  (char == "char7"){
      imgURL = "https://i.giphy.com/media/5UvmvS2eateZJG5b3J/giphy.webp"
      character = new Character(imgURL)
    }
    else if  (char == "char8"){
      imgURL = "https://2.bp.blogspot.com/-HH1Dy6rUmjc/WDfzBSnW-DI/AAAAAAAD1II/kAJbuwpess4IQWKQGxkWz8G5PKQ0cev7wCLcB/s1600/AS001131_00.gif"
      character = new Character(imgURL)
    }
    else {
      imgURL = "http://hanatemplate.com/images/flying-cartoon-characters-5.png"
      character = new Character(imgURL)
    }

    characterList.push(character)
  editor.setValue(currentRound.prompt)
  document.querySelector('#run-text').addEventListener('click', function(e){
    character = characterList[0]
    let demoText = editor.getValue()
    CodeMirror.runMode(demoText,'application/javascript', innerText)
    if (currentRound.level == 1) {
      updateUserScore(currentUser.score)
      if (demoText.includes("{" && "}")){
        invokeFunction = demoText.split('{').pop().split('}')[0];
        runLevelOneTest(invokeFunction)
      }
    }
  })
}

// document.addEventListener('click', playdatsound)

function playdatsound(){
  let sound = new Sound('winning.wav')
  sound.play()
}


function renderThisGame(currentUser){
  let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
  currentRound = allRounds.find(round => round.id == currentUserRound.round_id)
  beforeLogin.style.display = 'none'
  afterLogin.style.display = 'block'
  if (currentRound.level == 6) {
    textEditor.style.display = 'none'
    let body = document.querySelector('body')
    body.setAttribute('class', 'game-over')

    gameGraphics.innerHTML = `
      <div id="game-over-txt">
        <h1 id="you-win"> CONGRATULATIONS, ${currentUser.name}! YOU WON! </h1>
        <h3 class="game-text"> YOU ARE A JAVASCRIPT MASTER </h3>
        <h3 class="game-text"> YOUR SCORE: ${currentUser.score} </h3>
        <button class="btn" id="play-again"> Play Again? </button>
      </div>`
      won = new Sound('gamewin.wav')
      won.play()
      let playAgainBtn = document.querySelector('#play-again')
      playAgainBtn.addEventListener('click', clickPlayAgain)
    } else {
      innerText.innerHTML = ''
      gameGraphics.innerHTML = ''
      gameGraphics.innerHTML = `
        <h1 id="level" class="header"> Level ${currentRound.level} </h1>
        <img src='https://uniqueideas.co.uk/wp-content/uploads/2013/09/apple-air.png' id='container'>
          <div id="not-computer">
            <h3 id='username' class="level-text">USERNAME: ${currentUser.name} </h3>
            <h3 id='score' class="level-text">SCORE: ${currentUser.score} </h3>
            <img id="background-image" src= ${currentRound.background_image} style="width:850px;height:500px">
            <h3 id='challenge' class="level-text"> Challenge: ${currentRound.challenge} </h3>
          </div>
        <br>
        `
        characterList = []
        if (char == "char2"){
          imgURL = "https://talenthouse-res.cloudinary.com/image/upload/c_limit,h_1000,w_1000/v1/user-549495/submissions/ianomididwehoyihq6tq.gif"
          character = new Character(imgURL)
        }
        else if  (char == "char3"){
          imgURL = "https://webstockreview.net/images/clipart-woman-superhero-10.png"
          character = new Character(imgURL)
        }
        else if  (char == "char4"){
          imgURL = "https://i.pinimg.com/originals/ef/09/63/ef09630a4f8f8cff7f9bfacf134e476d.png"
          character = new Character(imgURL)
        }
        else if  (char == "char5"){
          imgURL = "https://i.giphy.com/media/YiAgLZcqoPKHHjHael/giphy.webp"
          character = new Character(imgURL)
        }
        else if  (char == "char6"){
          imgURL = "http://www.secondcapemaybaptist.church/wp-content/uploads/2018/07/Flying-SuperGirl-4.png"
          character = new Character(imgURL)
        }
        else if  (char == "char7"){
          imgURL = "https://i.giphy.com/media/5UvmvS2eateZJG5b3J/giphy.webp"
          character = new Character(imgURL)
        }
        else if  (char == "char8"){
          imgURL = "https://2.bp.blogspot.com/-HH1Dy6rUmjc/WDfzBSnW-DI/AAAAAAAD1II/kAJbuwpess4IQWKQGxkWz8G5PKQ0cev7wCLcB/s1600/AS001131_00.gif"
          character = new Character(imgURL)
        }
        else {
          imgURL = "http://hanatemplate.com/images/flying-cartoon-characters-5.png"
          character = new Character(imgURL)
        }
      characterList.push(character)

      editor.setValue(currentRound.prompt)
      document.querySelector('#run-text').addEventListener('click', function(e){
        character = characterList[0]
        let demoText = editor.getValue()
        CodeMirror.runMode(demoText,'application/javascript', innerText)
        if (currentRound.level == 1) {
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelOneTest(invokeFunction)
          }
        }
        else if (currentRound.level == 2) {
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelTwoTest(invokeFunction)
          }
        }
        else if (currentRound.level == 3) {
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            inputWithBrackets = demoText.split('sayHello(name)')[1];
            invokeFunction = inputWithBrackets.substring(1, inputWithBrackets.length - 3)
            runLevelThreeTest(invokeFunction)
          }
        }
        else if (currentRound.level == 4) {
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelFourTest(invokeFunction)
          }
        }
        else if (currentRound.level == 5) {
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            beforeIf = demoText.split('if (')[1]
            afterIf = beforeIf.split(')')[0]
            runLevelFiveTest(afterIf)
          }
        }
      })
    }
}
function clickPlayAgain(e){
  if (e.target.id == 'play-again') {
    won.stop()
    inputUN.value = ""
    updateUserRound(currentUserRound, character)
  }
}

Sound.prototype.stop = function(){
  this.sound.pause()
}

function runLevelOneTest(invokeFunction){
  var adder = new Function("a", "b", invokeFunction);
  var adderReturn = adder(4,10)
  var addFunc = new Function("a", "b", "return a + b")
  var addReturn= addFunc(4,10)

  let runDiv = document.querySelector('#inner-text')
  var modal = document.querySelector('#runModal')

  if (innerText.innerText == "undefined") {
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, return is undefined</h1>`
  }
  else if (adderReturn != addReturn){
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, function does not return correct value</h1>`
  }
  else if (chai.expect(adderReturn).to.equal(addReturn)){
    runDiv.style.display = "none"
    modal.style.display = "none"
    updateUserRound(currentUserRound, character)
  }
  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function runLevelTwoTest(invokeFunction){
  var inputMultiply = new Function("a", "b", "c", invokeFunction);
  var inputMultiplyReturn = inputMultiply(4,10,2)
  var ourMultiplyFunc = new Function("a", "b", "c", "return a * b * c")
  var ourMultiplyReturn = ourMultiplyFunc(4,10,2)

  let runDiv = document.querySelector('#inner-text')
  var modal = document.querySelector('#runModal')

  if (innerText.innerText == "undefined") {
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, return is undefined</h1>`
  }
  else if (inputMultiplyReturn != ourMultiplyReturn){
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, function does not return correct value</h1>`
  }
  else if (chai.expect(inputMultiplyReturn).to.equal(ourMultiplyReturn)){
    runDiv.style.display = "none"
    modal.style.display = "none"
    updateUserRound(currentUserRound, character)
  }

  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function runLevelThreeTest(invokeFunction){
  var inputSayHello = new Function("name", invokeFunction)
  var inputSayHelloReturn = inputSayHello("Sam")
  var ourSayHelloFunc = new Function("name", "return `Hello ${name}`")
  var ourSayHelloReturn = ourSayHelloFunc("Sam")

  let runDiv = document.querySelector('#inner-text')
  var modal = document.querySelector('#runModal')

  if (innerText.innerText == "undefined") {
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, return is undefined</h1>`
  }
  else if (inputSayHelloReturn != ourSayHelloReturn){
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, function does not return correct value</h1>`
  }
  else if (chai.expect(inputSayHelloReturn).to.equal(ourSayHelloReturn)){
    runDiv.style.display = "none"
    modal.style.display = "none"
    updateUserRound(currentUserRound, character)
  }

  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function runLevelFourTest(invokeFunction){
  var inputPush = new Function ("candyLand", "candy", invokeFunction)
  var inputPushReturn = inputPush(["Kit Kat", "Reeses Cup", "M&Ms"], "Snickers")
  var ourInnerFunc = "candyLand.push(candy)" + "\n" + "return candyLand"
  var ourPushFunc = new Function ("candyLand", "candy", ourInnerFunc)
  var ourPushReturn = ourPushFunc(["Kit Kat", "Reeses Cup", "M&Ms"], "Snickers")

  let runDiv = document.querySelector('#inner-text')
  var modal = document.querySelector('#runModal')

  if (innerText.innerText == "undefined") {
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, return is undefined</h1>`
  }
  else if (ourPushReturn[3] != inputPushReturn[3]){
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, function does not return correct value</h1>`
  }
  else if (chai.expect(ourPushReturn[3]).to.equal(inputPushReturn[3])){
    runDiv.style.display = "none"
    modal.style.display = "none"
    updateUserRound(currentUserRound, character)
  }

  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function runLevelFiveTest(afterIf){
  let runDiv = document.querySelector('#inner-text')
  var modal = document.querySelector('#runModal')
  if (!afterIf.includes("height > 48")) {
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Try Again</h1>`
  }
  if (afterIf != "height > 48"){
    runDiv.style.display = "block"
    modal.style.display = 'block'
    innerText.innerHTML = `<span class="close">&times;</span> <h1>Please try again, function does not return correct value</h1>`
  }
  else if (chai.expect(afterIf).to.equal("height > 48")){
    runDiv.style.display = "none"
    modal.style.display = "none"
    updateUserRound(currentUserRound, character)
  }

  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function updateUserScore(currentUserScore){
  let userName = currentUser.name
  updatedUserScore = currentUser.score + 20
  fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: userName,
        score: updatedUserScore
      }
    })
  })
  .then(response => response.json())
  .then(myJson => {
  currentUser = allUsers.find(user => user.id == myJson.id)
  currentUser.score = myJson.score
    })
}

solutionBtn = document.querySelector('#solution')


hintBtn.addEventListener('click', renderHint)
solution.addEventListener('click', renderSolution)

function renderSolution(e){
  solution = !solution
  let solutionDiv = document.querySelector('#solution-div')
  var modal = document.querySelector('#solModal')

  if (solution) {
    solutionDiv.innerHTML = `<span class="close">&times;</span><h1 id="solutionTxt">${currentRound.solution}</h1>`
    modal.style.display = 'block'
  } else {
    modal.style.display = 'none'
  }
  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
}

function renderHint(e){
  hint = !hint
  let hintDiv = document.querySelector('#hint-div')
  var modal = document.querySelector('#myModal')

  if (hint) {
    hintDiv.innerHTML = `<span class="close">&times;</span><h1 id="hintTxt">${currentRound.hint}</h1>`
    modal.style.display = 'block'

  } else {
    modal.style.display = 'none'
  }
  span = document.querySelector('.close')
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
}

function renderSomething(character, currentUser){
  character.remove()
  characterList = []
  let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
  renderThisGame(currentUser)
}


class Character {
  constructor(imgURL) {
    this.element = document.createElement("img");
    // this.element.setAttribute('class', 'img')
    this.speed = 12;
    this.movement = null;
    this.characterAssets = "assets/character";
    this.element.src = imgURL;
    this.element.style.position = "absolute";
    this.element.style.left = "375px";
    this.element.style.top = "280px";
    this.element.style.width = "200px";

    document.body.appendChild(this.element);
  }

  walkEast(imgURL) {
    clearInterval(this.movement);
    this.movement = setInterval(
      function() {
        let currentPosition = parseInt(this.element.style.left);
        this.element.style.left = currentPosition + 1 + "px";
        if (currentPosition == 920) {
          debugger
          this.stop()
          renderSomething(this.element, currentUser)
        }
      }.bind(this),
      this.speed
    );
    this.element.src = imgURL;
  }

  stop(imgURL) {
    clearInterval(this.movement);
    this.element.src = imgURL;
  }

}

function Sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)
  }

  Sound.prototype.play = function(){
    this.sound.play();
  }

  Sound.prototype.stop = function(){
    this.sound.pause();
  }
