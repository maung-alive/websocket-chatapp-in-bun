import { ServerWebSocket } from "bun";
import { addRoom, checkRoom } from "./database";

const server = Bun.serve({
  port: 3000,
  fetch(request, server){
    let { pathname, search } = new URL(request.url)

    let route = pathname.split("/")
    let id = 0
    if(route.length == 3){
      id = route[1] == "chat" && route[2]
    }
    const success = server.upgrade(request, {
      data: {
        roomID: id,
        params: search
      },
    });
    if (success) return undefined
    return 
  },

  websocket: {
    open(ws) {
      let { roomID, params } = ws.data
      if(roomID == 0) {
        ws.subscribe(roomID)
        ws.send(JSON.stringify({ text: `Connected -> server <--> client`}))
      } else if(roomID == 'create') {
        let roomName = params.split("?")[1]
        addRoom(`${roomName}`)
        .then(data => {
          ws.send(JSON.stringify({ text: `Created -> ${data.name}:${data.id}` }))
        })
      } else {
        checkRoom(roomID)
        .then(room => {
            if(room) {
              ws.subscribe(roomID)
              ws.send(JSON.stringify({ text: `Connected -> ${room.name} <--> client`}))
              console.log(`[+] Connected ${room.name}`)
            }
            else { ws.send(JSON.stringify({ error: "existenceError", id: roomID })) }
          }
        )
      }
    },

    async message(ws, message) {

      let { username, text } = JSON.parse(message)

      let alt = ""
      let src = ""
      let image = text.match(/!\[(.*)\]\((.+)\)/)
      if(image){
        alt = image[1]
        src = image[2].startsWith("javascript:") ? image[2].replace(":", ";") : image[2]
      }

      // prevent XSS and image parsing
      text = text.replace("<", "&lt;").replace(">", "&gt;").replace(/!\[(.*)\]\((.+)\)/, `<img src=${src} alt=${alt} />`)

      let data = JSON.stringify({ text: `${username} -> ${text}` })
      let roomID = ws.data.roomID
      ws.publish(data, roomID)
      server.publish(roomID, data);
    },

    close(ws) {
      console.log("Web socket closed")
    }
  }
})

console.log(`Listening at ${server.port}`)
