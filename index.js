// import {assert} from "chai"
console.log(chai)
// var assert = chai.assert

// const { assert } = require('chai');

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

let runText = document.querySelector('#run-text')
let innerText = document.querySelector('#inner-text')
let beforeLogin = document.querySelector('#before-login')
let afterLogin = document.querySelector('#after-login')
let inputUN = document.querySelector('#input-un')
let login = document.querySelector(".login")
let gameGraphics = document.querySelector('#game-graphics')
let hintBtn = document.querySelector('#hint')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded')
  fetchUsers()
  fetchUserRounds()
  fetchRounds()
  if (login) {
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
    }, // end of headers
    body: JSON.stringify({
      user: {
        name: loginInput
      } // end of users
    }) // end of body
  }) // end of fetch
  .then(response => response.json())
  .then(myJson => {
    currentUser = myJson
    allUsers.push(currentUser)
    createUserRound(currentUser)
    })
} // end of func

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
  debugger
  let user_id = currentUserRound.user_id
  let round_id = currentUserRound.round_id + 1
  let data = {
      user_round: {
        user_id: user_id,
        round_id: round_id
    }
  }
  console.log(data)
  console.log(user_id)
  console.log(round_id)
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
    debugger
    let currentPosition = parseInt(character.element.style.left);
    character.walkEast()
  })
}

function renderThisGame(currentUser){
  // debugger
  //put a modal here to put next level on the screen
  debugger
  let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
  currentRound = allRounds.find(round => round.id == currentUserRound.round_id)
  // debugger
  innerText.innerText = ''
  gameGraphics.innerHTML = ''
  gameGraphics.innerHTML = `
    <h1> Level ${currentRound.level} </h1>
    <h3> Challenge: ${currentRound.challenge} </h3>
    <h3> SCORE: ${currentUser.score} </h3>
    <div id="container">
      <img id="background-image" src= ${currentRound.background_image} style="width:900px">
    </div>
    `
  characterList = []
  character = new Character

  characterList.push(character)
  editor.setValue(currentRound.prompt)
  document.querySelector('#run-text').addEventListener('click', function(e){
    character = characterList[0]
    let demoText = editor.getValue()
    // debugger
    CodeMirror.runMode(demoText,'application/javascript', innerText)
    //write tests for each level
    if (currentRound.level == 1) {
      currentUser.score = 20
      if (demoText.includes("{" && "}")){
        invokeFunction = demoText.split('{').pop().split('}')[0];
        runLevelOneTest(invokeFunction)
      }
    }
    else if (currentRound.level == 2) {
      currentUser.score = 40
      // updateUserScore(currentUser.score)
      if (demoText.includes("{" && "}")){
        invokeFunction = demoText.split('{').pop().split('}')[0];
        runLevelTwoTest(invokeFunction)
      }
    }
    else if (currentRound.level == 3) {
      currentUser.score = 60
      // updateUserScore(currentUser.score)
      if (demoText.includes("{" && "}")){
        inputWithBrackets = demoText.split('sayHello(name)')[1];
        invokeFunction = inputWithBrackets.substring(1, inputWithBrackets.length - 3)
        // invokeFunction = inputWithBrackets.split('{').pop().split('}')[0]
        debugger
        runLevelThreeTest(invokeFunction)
      }
    }
  })
}

function runLevelOneTest(invokeFunction){
  var adder = new Function("a", "b", invokeFunction);
  var adderReturn = adder(4,10)
  var addFunc = new Function("a", "b", "return a + b")
  var addReturn= addFunc(4,10)
  if (innerText.innerText == "undefined") {
    innerText.innerText = "Please try again, return is undefined"
    console.log("i didnt work 1")
  }
  else if (adderReturn != addReturn){
    console.log("i didnt work 2")
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(adderReturn).to.equal(addReturn)){
    console.log("YOU DID IT!")
    debugger
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
    console.log("i didnt work 1")
  }
  else if (inputMultiplyReturn != ourMultiplyReturn){
    console.log("i didnt work 2")
    innerText.innerText = "Please try again, function does not return correct value"
  }
  else if (chai.expect(inputMultiplyReturn).to.equal(ourMultiplyReturn)){
    console.log("YOU DID IT!")
    updateUserRound(currentUserRound, character)
  }
}

function runLevelThreeTest(invokeFunction){
  debugger
  var inputSayHello = new Function("name", invokeFunction)
  var inputSayHelloReturn = inputSayHello("Sam")
  var ourSayHelloFunc = new Function("name", "return `Hello ${name}`")
  var ourSayHelloReturn = ourSayHelloFunc("Sam")
  if (chai.expect(inputSayHelloReturn).to.equal(ourSayHelloReturn)){
    console.log("YOU DID IT!")
    updateUserRound(currentUserRound, character)
  }
  else {
    console.log("didnt work")
  }
}







// function updateUserScore(currentUserScore){
//   let userName = currentUser.name
//   fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": 'application/json',
//       "Accept": 'application/json'
//     },
//     body: JSON.stringify({
//       user: {
//         name: userName,
//         score: currentUserScore
//       } //closes user
//     }) // closes body
//   }) // closes fetch
//   .then(response => response.json())
//   .then(myJson => {
//   currentUser = allUsers.find(user => user.id == myJson.id)
//   currentUser.score = myJson.score
//     })
// } // closes func


let hint = false

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
    this.speed = 5;
    this.movement = null;
    this.characterAssets = "assets/character";
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
    this.element.style.position = "absolute";
    // this.element.setAttribute("style", 'z-index=1')
    this.element.style.left = "10px";
    this.element.style.top = "350px";
    this.element.style.width = "200px";
    // let background = document.querySelector('#background-image')
    // background.setAttribute('style', 'z-index=-1')
    document.body.appendChild(this.element);
  }

  walkEast() {
    // console.log("first", this);
    clearInterval(this.movement);
    this.movement = setInterval(
      function() {
        // console.log("second", this);
        let currentPosition = parseInt(this.element.style.left);
        this.element.style.left = currentPosition + 1 + "px";
        if (currentPosition == 700) {
          this.stop()
          renderSomething(this.element)
        }
      }.bind(this),
      this.speed
    );
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
  }

  //file:///Users/sivanadler/Downloads/Untitled.svg

  stop() {
    clearInterval(this.movement);
    this.element.src = `http://hanatemplate.com/images/flying-cartoon-characters-5.png`;
  }

}
