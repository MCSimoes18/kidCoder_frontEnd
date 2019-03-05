editor.setValue("Welcome")

let allUsers = [];

let runText = document.querySelector('#run-text')
let innerText = document.querySelector('#inner-text')
let beforeLogin = document.querySelector('#before-login')
let inputUN = document.querySelector('#input-un')
let login = document.querySelector(".login")
document.querySelector('#run-text').addEventListener('click', runTextEditor)
login.addEventListener('submit', findUser)

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded')
  fetchUsers()
});

function fetchUsers(){
  fetch ('http://localhost:3000/api/v1/users')
  .then(response => response.json())
  .then(myJson => {
    allUsers = myJson
    console.log(allUsers)
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
      console.log(currentUser)
      // newUser = myJson
      // allUsers.push(newUser)
    })
    // console.log(allUsers)
} // end of func

function findUser(e){
  e.preventDefault()
  let loginInput = e.target.querySelector('#input-un').value
  let currentUser = allUsers.find(user => user.name == loginInput)
    if (currentUser == undefined){
      createUser(loginInput)
    }
    console.log(currentUser)
  }
