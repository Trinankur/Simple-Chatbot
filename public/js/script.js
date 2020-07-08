const socket = io();

const form = document.querySelector('form');
const input = document.querySelector('#m');
const reply = document.querySelector('#output-bot');
const speak = document.getElementById('speak');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.maxAlternatives = 1;


function mouseDown() {
    speak.style.boxShadow = '0 0 8px 5px #888888';
}

function mouseUp() {
    speak.style.boxShadow = 'none';
}

speak.addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected');
});

recognition.addEventListener('result', e => {
    const text = event.results[0][0].transcript;
    console.log(text);
    input.value = text;
    socket.emit('bot message', text);
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
})

form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = input.value;
    socket.emit('bot message', msg);
    return false;
});

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

socket.on('bot message', msg => {
    synthVoice(msg);
    const text = document.createTextNode(msg);
    const prev = reply.firstChild;
    reply.replaceChild(text, prev);
})