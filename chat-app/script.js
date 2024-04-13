const HelpTEXT = `
<span class="response">commands ~ </span>
<span class="response"><span class="tab"></span>// Set or show username</span>
<span class="response"><span class="tab"></span>::username &lt;USERNAME&gt;</span>
<span class="response">&nbsp;</span>
<span class="response"><span class="tab"></span>// Join a room</span>
<span class="response"><span class="tab"></span>::join &lt;roomID&gt;</span>
<span class="response">&nbsp;</span>
<span class="response"><span class="tab"></span>// Create a new room</span>
<span class="response"><span class="tab"></span>::create &lt;roomName&gt;</span>
<span class="response">&nbsp;</span>
<span class="response"><span class="tab"></span>// Just Send Message</span>
<span class="response"><span class="tab"></span>&lt;messageText&gt;</span>
<span class="response">&nbsp;</span>
<span class="response"><span class="tab"></span>// Sending Images</span>
<span class="response"><span class="tab"></span>![alt](src)</span>
<span class="response">&nbsp;</span>
<span class="response"><span class="tab"></span>// Help Text</span>
<span class="response"><span class="tab"></span>::help</span>
<span class="response">&nbsp;</span>
`

var HOST = window.location.host.split(':')[0];
var USERNAME = localStorage.getItem("username");
var ws = new WebSocket(`ws://${window.HOST}:3000`);

const addWSEventListener = () => {
  window.ws.addEventListener("open", (e) => {
    console.log("Connection opened");
  })
  window.ws.addEventListener("message", e => {
    let data = JSON.parse(e.data)
    if(data.error) {
      showResponse(`${data.error} -> ${data.id}`)
      return
    }
    showResponse(data.text)
    scroll()
  })
  window.ws.addEventListener("close", e => {
    showResponse(`wsClosed -> code: ${e.code}`)
  })
  window.ws.onError = e => {
    showResponse(e)
  }
}

const showResponse = (msg) => {
  document.querySelector('#resp-box').innerHTML += response(msg)
}

function connector(target) {
  window.ws.close()
  window.ws = new WebSocket(target)
  addWSEventListener()
}

const getUsername = () => {
  let username = localStorage.getItem("username") || "NONE // to set ::username <USERNAME>";
  return username
}

const setUsername = (username) => {
  localStorage.setItem("username", username)
  window.USERNAME = localStorage.getItem("username")
  document.querySelector(".prompt").innerHTML = `${window.USERNAME} -> `
  return `username set -> ${localStorage.getItem("username")}`
}

const joinRoom = (roomID) => {
  return connector(`ws://${window.HOST}:3000/chat/${roomID}`)
}

const createRoom = (roomName) => {
  connector(`ws://${window.HOST}:3000/chat/create?${roomName}`)
}

const response = (msg) => {
  return `<span class="response">${msg}</span>`
}

const checkKeyword = (command) => {
  let splited = command.split(" ")
  if(splited[0] == "::help") {
    showResponse(HelpTEXT);
  } else if(splited[0] == "::username") {
    if(splited[1] == "" || splited[1] == null){
      let msg = getUsername()
      showResponse(msg)
    } else {
      let msg = setUsername(splited[1])
      showResponse(msg)
    }
  } else if(splited[0] == "::join") {
    if(splited[1] == "" || splited[1] == null){
      showResponse(`clientError -> &lt;roomID&gt; required`)
    }else {
      joinRoom(splited[1])
    }
  } else if(splited[0] == "::create") {
    if(splited[1] == "" || splited[1] == null){
      showResponse(`clientError -> room name is required`)
    }else{
      createRoom(splited[1])
    }
  } else {
    if(command){
      let data = {
        username: window.USERNAME,
        text: command
      }
      window.ws.send(JSON.stringify(data))
    }else {
      showResponse(command || "clientError -> required a message")
    }
  }
}

function scroll() {
  let respBox = document.querySelector(".block")
  let lasEle = respBox.lastElementChild;
  lasEle.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

const box = document.querySelector("#command")

box.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let command = document.querySelector("#command").value
    checkKeyword(command)
    document.querySelector("#command").value = ''
    scroll()
  }
});


connector(`ws://${window.HOST}:3000/chat/0`)
document.querySelector(".prompt").innerHTML = `${window.USERNAME} -> `
