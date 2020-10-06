const generateMessage=(username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().toString()
    }
}
const generateLocation=(username,url)=>{
   return {
    username,
    url:url,
    createdAt:new Date().getTime()
    }
}
module.exports={ generateMessage,generateLocation}