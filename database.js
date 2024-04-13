import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// create a new room
export const addRoom = async (name) => {
  let room = await prisma.ChatRoom.create({
    data: {
      name: name,
    },
  });
  return {
    id: room.id,
    name: room.name
  }
}

// check if room is exist
export const checkRoom = async (id) => {
  let room = await prisma.ChatRoom.findUnique({
    where: {
      id: id
    }
  })
  return room
}
