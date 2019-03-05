editor.setValue("Welcome")

let allUsers = [];
let allUserRounds = []

let runText = document.querySelector('#run-text')
let innerText = document.querySelector('#inner-text')
let beforeLogin = document.querySelector('#before-login')
let afterLogin = document.querySelector('#after-login')
let inputUN = document.querySelector('#input-un')
let login = document.querySelector(".login")
let gameGraphics = document.querySelector('#game-graphics')
document.querySelector('#run-text').addEventListener('click', runTextEditor)


document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded')
  fetchUsers()
  fetchUserRounds()
  if (login) {
    afterLogin.style.display = 'none'
  }
  login.addEventListener('submit', findUser)
});

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

function runTextEditor(e){
  let demoText = editor.getValue()
  CodeMirror.runMode(demoText,'application/javascript', innerText)
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
  let currentUser = allUsers.find(user => user.name == loginInput)
    if (currentUser == undefined){
      createUser(loginInput)
    }
    afterLogin.style.display = 'block'
    beforeLogin.style.display = 'none'
    // this.user = currentUser
    // debugger
    let currentUserRound = allUserRounds.find(user_round => user_round.user_id == currentUser.id)
    console.log(currentUserRound)
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
      console.log(allUserRounds)
    })
  }

// function renderThisGame(currentUser){
//   gameGraphics.innerHTML = `
//   <img src= ${curr}>
//   `
// }
