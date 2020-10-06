const users=[]

const addUser=({id,username,room})=>{
    
    //claean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    
    //validate the data
    if(!username || !room)
    {
        return{
            error:'username and room are required'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room==room && user.username==username
    })

    //validate user name
    if(existingUser){
        return{
            error:'username already exist'
        }
    }

    //store user 
    const user={id,username,room}
    users.push(user)
    return {user}

}
//remove user
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{    //filter is keep running after finding a match but find is stoped after finding the natch
        return user.id==id
    })

    if(index!=-1)
    {
        return users.splice(index,1)[0] //return array of  removing item [0] to accext first object
    }
    return {
   error:"usser not found"
    }
}

//get user by ID
const getUser=(id)=>{
   return users.find((user)=>{
       return user.id==id
   })
}

//get users by userRoom 
const getUsersInRoom=(room)=>{
    return users.filter((user)=>{
        return user.room==room
    })
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}