const path=require('path');
const http=require('http')
const express=require('express')
const Filter=require('bad-words')
const socketio=require('socket.io')
const {generateMessage,generateLocation}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');

const app=express();
const server=http.createServer(app) 
const io=socketio(server) //connect socket.io to server
const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath)) //serving route path i.e index.html


io.on('connection',(socket)=>{     
console.log('new user conncetion')


// listen to room
socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})
    if(error)
    {
      return callback(error);
    }
      socket.join(user.room) //join the room
      socket.emit('message',generateMessage('Admin','Welcome!'))
      socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`)) 
      io.to(user.room).emit('roomData',{
          room:user.room,
          users:getUsersInRoom(user.room)
      })
      callback() //for ackknowledgement 
})



//listen to messages sent by client
socket.on('sendMessage',(mymessage,callback)=>{
   const user=getUser(socket.id)
   const filter=new Filter()
   if(filter.isProfane(mymessage))
   return callback('profone is not allowed')

    io.to(user.room).emit('message',generateMessage(user.username,mymessage)) //send back to client
    callback('recieved')

})


//listen to location sent by user
socket.on('sendLocation',(coords,callback)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('locationMessage',generateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
})



socket.on('disconnect',()=>{     // when a user left 'disconnect' evnet is called which is take care by build in
        //socket.io library
        const user=removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    
    }
})
 
}) //end of connection event

server.listen(port,()=>{
    console.log('serverm is running')
})