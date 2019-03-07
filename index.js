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
  if (login) {
    let body = document.querySelector('body')
    body.setAttribute('id', 'pre-login')
    afterLogin.style.display = 'none'
  }
  login.addEventListener('submit', findUser)
});

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
        name: loginInput
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
  let loginInput = e.target.querySelector('#input-un').value
  currentUser = allUsers.find(user => user.name == loginInput)
  currentUserArr = []
  currentUserArr.push(currentUser)
    if (currentUser == undefined){
      createUser(loginInput)
    }
    afterLogin.style.display = 'block'
    beforeLogin.style.display = 'none'
    currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
    renderThisGame(currentUser)
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
  let user_id = currentUserRound.user_id
  let round_id = currentUserRound.round_id + 1
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
    currentUserRound = allUserRounds.find(userRound => userRound.id == myJson.id)
    currentUserRound.round_id = myJson.round_id
    let currentPosition = parseInt(character.element.style.left);
    character.walkEast()
  })
}

function renderThisGame(currentUser){
  //put a modal here to put next level on the screen
  let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
  currentRound = allRounds.find(round => round.id == currentUserRound.round_id)
  if (currentRound.level == 6) {
    textEditor.innerHTML = ""
    let body = document.querySelector('body')
    body.setAttribute('class', 'new')
    afterLogin.innerHTML = `
      <!-- <div id="game-over"> -->
        <div id="game-over-txt">
          <h1 id="you-win"> YOU WON! </h1>
          <h3 class="game-text"> YOU ARE A JAVASCRIPT MASTER </h3>
          <br>
          <h3 class="game-text"> YOUR SCORE: 100 Points </h3>
          <button id="play-again"> Play Again? </button>
        <!-- </div> -->
      </div>`
      debugger
    } else {
      innerText.innerText = ''
      gameGraphics.innerHTML = ''
      gameGraphics.innerHTML = `
        <h1 id="level"> Level ${currentRound.level} </h1>
        <img src='https://uniqueideas.co.uk/wp-content/uploads/2013/09/apple-air.png' id='container'>
          <div id="not-computer">
            <h3 id='score'> SCORE: ${currentUser.score} </h3>
            <img id="background-image" src= ${currentRound.background_image} style="width:850px;height:500px">
            <h3 id='challenge'> Challenge: ${currentRound.challenge} </h3>
          </div>
        <br>
        `
      characterList = []
      character = new Character

      characterList.push(character)
      editor.setValue(currentRound.prompt)
      document.querySelector('#run-text').addEventListener('click', function(e){
        character = characterList[0]
        let demoText = editor.getValue()
        CodeMirror.runMode(demoText,'application/javascript', innerText)
        if (currentRound.level == 1) {
          currentUser.score = 20
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelOneTest(invokeFunction)
          }
        }
        else if (currentRound.level == 2) {
          currentUser.score = 40
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelTwoTest(invokeFunction)
          }
        }
        else if (currentRound.level == 3) {
          currentUser.score = 60
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            inputWithBrackets = demoText.split('sayHello(name)')[1];
            invokeFunction = inputWithBrackets.substring(1, inputWithBrackets.length - 3)
            runLevelThreeTest(invokeFunction)
          }
        }
        else if (currentRound.level == 4) {
          currentUser.score = 80
          updateUserScore(currentUser.score)
          if (demoText.includes("{" && "}")){
            invokeFunction = demoText.split('{').pop().split('}')[0];
            runLevelFourTest(invokeFunction)
          }
        }
        else if (currentRound.level == 5) {
          currentUser.score = 100
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

function runLevelOneTest(invokeFunction){
  var adder = new Function("a", "b", invokeFunction);
  var adderReturn = adder(4,10)
  var addFunc = new Function("a", "b", "return a + b")
  var addReturn= addFunc(4,10)
  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
  }
  else if (adderReturn != addReturn){
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(adderReturn).to.equal(addReturn)){
    updateUserRound(currentUserRound, character)
  }
}

function runLevelTwoTest(invokeFunction){
  var inputMultiply = new Function("a", "b", "c", invokeFunction);
  var inputMultiplyReturn = inputMultiply(4,10,2)
  var ourMultiplyFunc = new Function("a", "b", "c", "return a * b * c")
  var ourMultiplyReturn = ourMultiplyFunc(4,10,2)
  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
  }
  else if (inputMultiplyReturn != ourMultiplyReturn){
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(inputMultiplyReturn).to.equal(ourMultiplyReturn)){
    updateUserRound(currentUserRound, character)
  }
}

function runLevelThreeTest(invokeFunction){
  var inputSayHello = new Function("name", invokeFunction)
  var inputSayHelloReturn = inputSayHello("Sam")
  var ourSayHelloFunc = new Function("name", "return `Hello ${name}`")
  var ourSayHelloReturn = ourSayHelloFunc("Sam")

  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
  }
  else if (inputSayHelloReturn != ourSayHelloReturn){
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(inputSayHelloReturn).to.equal(ourSayHelloReturn)){
    updateUserRound(currentUserRound, character)
  }
}

function runLevelFourTest(invokeFunction){
  var inputPush = new Function ("candyLand", "candy", invokeFunction)
  var inputPushReturn = inputPush(["Kit Kat", "Reeses Cup", "M&Ms"], "Snickers")
  var ourInnerFunc = "candyLand.push(candy)" + "\n" + "return candyLand"
  var ourPushFunc = new Function ("candyLand", "candy", ourInnerFunc)
  var ourPushReturn = ourPushFunc(["Kit Kat", "Reeses Cup", "M&Ms"], "Snickers")
  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
  }
  else if (ourPushReturn[3] != inputPushReturn[3]){
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(ourPushReturn[3]).to.equal(inputPushReturn[3])){
    updateUserRound(currentUserRound, character)
  }
}

function runLevelFiveTest(afterIf){
  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
  }
  else if (afterIf != "height > 48"){
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(afterIf).to.equal("height > 48")){
    updateUserRound(currentUserRound, character)
  }
}


function updateUserScore(currentUserScore){
  let userName = currentUser.name
  fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: userName,
        score: currentUserScore
      } //closes user
    }) // closes body
  }) // closes fetch
  .then(response => response.json())
  .then(myJson => {
  currentUser = allUsers.find(user => user.id == myJson.id)
  currentUser.score = myJson.score
    })
} // closes func




hintBtn.addEventListener('click', renderHint)

function renderHint(e){
  hint = !hint
  let hintDiv = document.querySelector('#hint-div')
  if (hint) {
    hintDiv.innerHTML = `<h1 id="hintTxt">${currentRound.hint}</h1>`
    hintDiv.style.display = 'block'
  } else {
    hintDiv.style.display = 'none'
  }
}

function renderSomething(character){
  currentUser = currentUserArr[0]
  character.remove()
  characterList = []
  let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
  renderThisGame(currentUser)
}


class Character {
  constructor() {
    this.element = document.createElement("img");
    this.element.setAttribute('class', 'img')
    this.speed = 5;
    this.movement = null;
    this.characterAssets = "assets/character";
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
    this.element.style.position = "absolute";
    this.element.style.left = "375px";
    this.element.style.top = "280px";
    this.element.style.width = "200px";

    document.body.appendChild(this.element);
  }

  walkEast() {
    clearInterval(this.movement);
    this.movement = setInterval(
      function() {
        let currentPosition = parseInt(this.element.style.left);
        this.element.style.left = currentPosition + 1 + "px";
        if (currentPosition == 920) {
          this.stop()
          renderSomething(this.element)
        }
      }.bind(this),
      this.speed
    );
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
  }

  stop() {
    clearInterval(this.movement);
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
  }

}
