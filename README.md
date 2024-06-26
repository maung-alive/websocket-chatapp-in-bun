# Websocket chat app in bun
To install dependencies:

```bash
bun install
```

To run web-socket server:

```bash
bun run index.js
```

Web interface files are in:

```bash
./chat-app/
```

This project was created using `bun init` in bun v1.1.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Public Room
You automatically join the public chat room when you enter the site. You can also join it later using the ```::join 0``` command. To leave the public room, simply enter a different room or close the tab 👻.

## create a room
To create a room, just simply type

```::create <ROOM-NAME>```

## join a room
As a anonymous chat app, no chat history is saved. Only room name and unique uuid were saved. Join a chat room using following command.

```::join <uuid-uuid-uuid-uuid>```

_Public room id is 0_

## sending images
You can send pics using markdown format but no image storage is support.

```![alt](src)```

_If there any security vuln, contact me_

## changing username
Default username is null. It's not even text, it is just null! However, you can change the username with ```::username <NEW USERNAME>```

## help text
For instruction, ```::help```
```
Connected -> server <--> client
commands ~
// Set or show username
::username <USERNAME>

// Join a room
::join <roomID>

// Create a new room
::create <roomName>

// Just Send Message
<messageText>

// Sending Images
![alt](src)

// Help Text
::help
```
