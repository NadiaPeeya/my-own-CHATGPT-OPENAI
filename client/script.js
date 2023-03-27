import bot from './assets/bot2.jpg';
import user from './assets/images.jpeg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval (() => {

    //updating the text content of loading indicator
   element.textContent += '.';

   //If the loading indicator has reached three dots, reset it
   if(element.textContent === '....'){
    element.textContent = ' ';
   }
  }, 300) 
}

function typeText ( element, text){
  let index = 0;
  let interval = setInterval (()=> {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++
    }
    else {
      clearInterval (interval)
    }
  }, 20)
}

function generateUniqueId () {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId){
return (
  ` 
   <div class ="wrapper ${isAi && 'ai'}">
   <div class = "chat">
    <div class= "profile"> 
    <img 
    src = ${isAi ? bot: user}
    alt = "${isAi ? 'bot' : 'user'}"
    />
    </div>
    <div style={{color: 'black'}} class= "message" id=${uniqueId}>
    ${value}
    </div>
   </div>
   </div>
  `
)
}

const handleSubmit = async (e) => {
  e.preventDefault();

 const data = new FormData(form);


 //user's chat stripe
chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

form.reset();

//bot's chat stripe

const uniqueId = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " " , uniqueId);


//to focus scroll to the bottom
chatContainer.scrollTop = chatContainer.scrollHeight;


const messageDiv = document.getElementById(uniqueId);

loader(messageDiv);

//fetch data from server - > bot's response

const response = await fetch('https://nadias-chatbot.onrender.com',{
  
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = " ";
   if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    console.log({parsedData});

    typeText(messageDiv, parsedData);
   }
   else {
    const err = await response.text();
    messageDiv.innerHTML = "Something Went Wrong";
    alert(err);
   } 
  
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})