const socket=io()  //used to connect my client side javascript to socket.io by callinf io() provided by socket.io librabry

//element
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages')//select the elemnt in which u want to render



// All template
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true}) //2nd argument to igonre ?


//autoscroll
const autoscroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild

    //hieght of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHieght=$newMessage.offsetHeight + newMessageMargin
    
    //visible hieght
    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=$messages.scrollHeight

    //how far i have scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight
    
    if(containerHeight-newMessageHieght <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}


//listen to message send by server
socket.on('message',(message)=>{
console.log(message)
const html=Mustache.render(messageTemplate,{   
 username:message.username,
 new_message:message.text,
 createdAt:moment(message.createdAt).format('h:mm a')
})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})


//location message send back by server
socket.on('locationMessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
 document.querySelector("#sidebar").innerHTML=html
})

//add messages
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled') //button is disabled
    const message=e.target.elements.message.value 
    //send message to server
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled') //enabbled
        $messageFormInput.value=''
        $messageFormInput.focus() //input back to focus
        if(error)
        {
            return console.log(error)
        }
        console.log('Message deliverd',message)
    })
})


//add loactions
$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation) //geolocation is sccessed by navigator.geoloaction
    return alert('geolocation is not supported by your browser')
   $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude},()=>{
                $sendLocationButton.removeAttribute('disabled')
                console.log('location shared')
            })
    })
})

//sending room ID
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='./'
    }
})