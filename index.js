editor.setValue("Welcome")

let allUsers = [];
let allUserRounds = []
let allRounds = []
let characterList = []
let currentUserArr = []
let currentUser
let currentRound

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
    let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
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
  let round_id = ++currentUserRound.round_id
  console.log(user_id)
  console.log(round_id)
  // debugger
  fetch(`http://localhost:3000/api/v1/user_rounds/${currentUserRound.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      user_round: {
        user_id: user_id,
        round_id: round_id
      }
    })
  })
  .then(response => response.json())
  .then(myJson => {
    let currentPosition = parseInt(character.element.style.left);
    character.walkEast()
  })
}

function renderThisGame(currentUser){
  // debugger
  //put a modal here to put next level on the screen
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
  let character = new Character

  characterList.push(character)
  editor.setValue(currentRound.prompt)
  document.querySelector('#run-text').addEventListener('click', function(e){
    let character = characterList[0]
    let demoText = editor.getValue()
    // debugger
    CodeMirror.runMode(demoText,'application/javascript', innerText)
    //write tests for each level
    if (currentRound.level == 1) {
      currentUser.score = 20
      if (innerText.innerText == 14) {
        updateUserRound(currentUserRound, character)
      }
    } else if (currentRound.level == 2) {
      currentUser.score = 40
      if (innerText.innerText == 16) {
        updateUserRound(currentUserRound, character)
      }
    }

  })
}
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
  let currentUser = currentUserArr[0]
  // debugger
  character.remove()
  characterList = []
  renderThisGame(currentUser)
}


class Character {
  constructor() {
    this.element = document.createElement("img");
    this.speed = 5;
    this.movement = null;
    this.characterAssets = "assets/character";
    this.element.src = `file:///Users/sivanadler/Downloads/Untitled%20(1).svg`;
    this.element.style.position = "absolute";
    // this.element.setAttribute("style", 'z-index=1')
    this.element.style.left = "0px";
    this.element.style.top = "220px";
    this.element.style.width = "500px";
    // let background = document.querySelector('#background-image')
    // background.setAttribute('style', 'z-index=-1')
    document.body.appendChild(this.element);
  }

  walkEast() {
    // console.log("first", this);
    this.movement = setInterval(
      function() {
        // console.log("second", this);
        let currentPosition = parseInt(this.element.style.left);
        this.element.style.left = currentPosition + 1 + "px";
        if (currentPosition == 750) {
          this.stop()
          renderSomething(this.element)
        }
      }.bind(this),
      this.speed
    );
    this.element.src = `file:///Users/sivanadler/Downloads/Untitled%20(1).svg`;
  }

  //file:///Users/sivanadler/Downloads/Untitled.svg

  stop() {
    clearInterval(this.movement);
    this.element.src = `file:///Users/sivanadler/Downloads/Untitled%20(1).svg`;
  }

}
