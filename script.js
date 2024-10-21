
let memory = {
    lastQuery: null,
};

const toggleButton = document.querySelector('.toggle-theme button');
const body = document.body;
const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voiceGif = document.querySelector(".voice-gif");
const textarea = document.getElementById("speech-output");
const voiceChanger = document.getElementById("voice-changer");


toggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        toggleButton.textContent = 'Dark Mode';
    } else {
        body.classList.add('dark-mode');
        toggleButton.textContent = 'Light Mode';
    }
});

function speak(text) {
    let responseTextarea = document.getElementById('speech-output');
    responseTextarea.style.display = 'block';
    responseTextarea.value = text;

    let voices = window.speechSynthesis.getVoices();
    let selectedVoiceIndex = voiceChanger.value;
    let selectedVoice = voices[selectedVoiceIndex] || voices[0];

    let sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    sentences.forEach((sentence) => {
        let utterance = new SpeechSynthesisUtterance(sentence.trim());
        utterance.voice = selectedVoice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    });
}

function setUserPreference(key, value) {
    sessionStorage.setItem(key, value);
}


function getUserPreference(key) {
    return sessionStorage.getItem(key);
}

function askUserName() {

    let storedName = getUserPreference('userName');

    if (!storedName) {

        speak("Please enter your name to continue.");
        let nameInput = document.createElement('input');
        nameInput.placeholder = "Enter your name (max 2 words)";
        nameInput.id = 'name-input';
        nameInput.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px; display: block; border:  1px solid black;";

        document.body.appendChild(nameInput);


        let submitButton = document.createElement('button');
        submitButton.textContent = "Submit";
        submitButton.id = 'submit-button';
        submitButton.style = "position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; display: block; border: 1px solid green";
        document.body.appendChild(submitButton);


        submitButton.onclick = function () {
            let name = nameInput.value.trim();


            if (name.split(' ').length > 2) {
                speak("Please enter only your first and last name.");
            } else if (name) {

                setUserPreference('userName', name);


                wishMe();
                document.getElementById('speech-output').value = `Hello ${name} How can I assist you today?`;


                document.body.removeChild(nameInput);
                document.body.removeChild(submitButton);
            } else {
                speak("Please enter a valid name.");
            }
        };
    } else {

        speak(`Hello ${storedName}! How can I assist you today?`);
        document.getElementById('speech-output').value = `${greeting} ${storedName}How can I assist you today?`;
    }
}


function wishMe() {
    let date = new Date();
    let hours = date.getHours();
    let greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
    let name = getUserPreference('userName');
    speak(`${greeting} ${name} How can I assist you today?`);
}
window.addEventListener('load', () => {
    askUserName();
});


let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};


btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = 'none';
    voiceGif.style.display = 'block';
});

function takeCommand(message) {
    btn.style.display = 'flex';
    voiceGif.style.display = 'none';

    if (message.includes("weather") || message.includes("joke") || message.includes("time")) {
        memory.lastQuery = message;
    }


    if (message.includes("tomorrow") && memory.lastQuery && memory.lastQuery.includes("weather")) {
        speak("I'll fetch the weather for tomorrow.");

    }

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello How can I assist you today?");
    }
    else if (message.includes("who are you")) {
        speak("My name is Rajni, your virtual assistant, here to help you.");
    }
    else if (message.includes("tum kaun ho")) {
        speak("Mera naam Rajni hai mai ek aabhaasee sahaaika hun aur apki madad karne ke liye  yahaan hoon aap jo chahe mujhse puchh sakte hai mai jawab dene ki koshish karungi");
    }
    else if (message.includes("who Created you")) {
        speak("I am created by Rajnish Yadav ji , He is my god");
    }
    else if (message.includes("tumhe kisne banaya hai")) {
        speak("mujhe Rajnish yadav ji ne banaya hai vahi mere bhagwaan hai .");
    }
    else if (message.includes("how are you")) {
        speak("I'm doing well, thank you! How about you?");
    }
    else if (message.includes("Tum kaisi ho")) {
        speak("main to thik hun vaise puchhane ke liye dhanyavaad aap kaise ho");
    }
    else if (message.includes("what can you do")) {
        speak("I can assist you with various tasks, including opening websites, telling the time, and more!");
    }
    else if (message.includes("tum kya kar sakti ho") || message.includes("tum kya kar sakte ho")) {

        speak("main aap ke bahut se kaamo me aapki sahayata kar sakti hun  jaise ki website khulane, samay batana , aur bhi bahut kuchh yaha tak ki mai aapko ek chutkula suna sakti hun jisper aapko bilkul hasi nahi aayegi  ");

    }
    else if (message.includes("open google")) {
        speak("Opening Google.");
        window.open("https://www.google.com/", "_blank");
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric" });
        speak("Today is " + date);
    }
    else if (message.includes("tell me a joke")) {
        fetch("https://official-joke-api.appspot.com/random_joke")
            .then(response => response.json())
            .then(data => {
                let joke = `${data.setup} ... ${data.punchline}`;
                speak(joke);  // 
            })
            .catch(error => {
                speak("I couldn't fetch a joke right now. Please try again later.");
            });
    }

    else if (message.includes(" ek chutkula sunao") || message.includes("mujhe ek joke sunao")) {
        const hindiJokes = [
            { setup: "डॉक्टर: आपके तीन दांत कैसे टूटे?", punchline: "पप्पू: बीवी ने मना किया था कि कोल्ड ड्रिंक मत पीना... फिर मैंने छुप कर पी ली और बीवी ने बोतल देख ली!" },
            { setup: "टीचर: तुम स्कूल क्यों नहीं आए?", punchline: "पप्पू: जी ब्यूटी स्लीप ले रहा था!" },
            { setup: "पत्नी: सुनिए जी, मैं मर जाऊंगी तो आप क्या करेंगे?", punchline: "पति: मैं भी मर जाऊंगा। पत्नी: क्यों? इतना प्यार करते हो मुझसे? पति: नहीं, उस खुशी में!" },
            { setup: "शादी के बाद पत्नी: मैं रोज तुमसे प्यार करूँगी!", punchline: "पति: मुझे कुछ दिन की छुट्टी भी मिलेगी या नहीं?" },
            { setup: "पप्पू: मेरे कान में आवाज़ आ रही है।", punchline: "डॉक्टर: अरे मूरख, ये आवाज़ मोबाइल की है!" }
        ];
        function getHindiJoke() {
            const randomIndex = Math.floor(Math.random() * hindiJokes.length);
            const joke = hindiJokes[randomIndex];
            return `${joke.setup} ... ${joke.punchline}`;
        }
        const joke = getHindiJoke();
        speak(joke);

    }

    else if (message.includes("tell me a quote")) {
        fetch("https://api.quotable.io/random")
            .then(response => response.json())
            .then(data => {
                let quote = `"${data.content}" - ${data.author}`;
                speak(quote);  // 
            })
            .catch(error => {
                speak("I couldn't fetch a quote right now. Please try again later.");
            });
    }
    else if (message.includes("tell me trivia")) {
        fetch("https://opentdb.com/api.php?amount=1")
            .then(response => response.json())
            .then(data => {
                let trivia = `${data.results[0].question}`;
                speak(trivia);  // 
            })
            .catch(error => {
                speak("I couldn't fetch trivia right now. Please try again later.");
            });
    }
    else if (message.includes("tell me a fact")) {
        fetch("https://uselessfacts.jsph.pl/random.json?language=en")
            .then(response => response.json())
            .then(data => {
                let fact = `${data.text}`;
                speak(fact);  // 
            })
            .catch(error => {
                speak("I couldn't fetch a fact right now. Please try again later.");
            });
    }
    else if (message.includes("open youtube")) {
        speak("opening Youtube")
        window.open("https://www.youtube.com/", "_blank")
    }
    else if (message.includes("open google")) {
        speak("opening google")
        window.open("https://www.google.com/", "_blank")
    }
    else if (message.includes("open facebook")) {
        speak("opening facebook")
        window.open("https://www.facebook.com/", "_blank")
    }
    else if (message.includes("open instagram")) {
        speak("opening facebook")
        window.open("https://www.facebook.com/", "_blank")
    }
    else if (message.includes("open calculator")) {
        speak("opening calculator")
        window.open("calculator://")
    }

    else if (message.includes("weather")) {
        speak("I can fetch the current weather for you. Please wait...");
        window.open("https://www.weather.com/", "_blank");
    }
    else {
        let finalText = "this is what i found on internet regarding" + message.replace("sonia", "") || message.replace("sonia", "")
        speak(finalText)
        window.open(`https://www.google.com/search?q=${message.replace("sonia ", "")}`, "_blank")

    }
}


function populateVoiceList() {
    let voices = window.speechSynthesis.getVoices();
    voiceChanger.innerHTML = '';

    if (!voices.length) {
        voiceChanger.innerHTML = '<option>No voices available</option>';
        return;
    }

    let specialVoices = [];
    if (voices[168]) specialVoices.push({ index: 168, label: 'special-voice1(Men-Hindi)' });
    if (voices[169]) specialVoices.push({ index: 169, label: 'special-voice2(Girl-Hindi)' });


    specialVoices.forEach((voiceData) => {
        let option = document.createElement('option');
        option.value = voiceData.index;
        option.textContent = voiceData.label;
        voiceChanger.appendChild(option);
    });

    voices.forEach((voice, index) => {
        if (index === 168 || index === 169) return;

        let option = document.createElement('option');
        let label;


        if (index === 0) {
            label = 'boy-english';
        } else if (index === 1) {
            label = 'boy-english';
        } else if (index === 2) {
            label = 'girl-english';
        } else if (index === 3) {
            label = 'boy-hindi(Baklol)';
        } else if (index === 4) {
            label = 'girl-hindi';
        } else {
            label = `Voice ${index + 1} - ${voice.lang}`;  // Default label for other voices
        }

        option.value = index;
        option.textContent = label;
        voiceChanger.appendChild(option);
    });

    voiceChanger.selectedIndex = 1;
}

window.speechSynthesis.onvoiceschanged = populateVoiceList;

voiceChanger.addEventListener('change', () => {
    let selectedVoiceIndex = voiceChanger.value;
    let selectedVoice = window.speechSynthesis.getVoices()[selectedVoiceIndex];

    if (selectedVoice) {
        console.log(`Voice changed to: ${selectedVoice.name}`);

    }
});

voiceChanger.addEventListener('change', () => {
    let selectedVoiceIndex = voiceChanger.value;
    setUserPreference('selectedVoice', selectedVoiceIndex);
});

const text = "What can I help you today ?";
const words = text.split(" ");
let i = 0;
let j = 0;
let currentWord = "";
const typingSpeed = 30;

const first = document.getElementById("first");

function type() {
    if (i < words.length) {
        currentWord = words[i];
        if (j < currentWord.length) {
            first.innerHTML += currentWord[j];
            j++;
            setTimeout(type, typingSpeed);
        } else {

            first.innerHTML += " ";
            i++;
            j = 0;
            setTimeout(type, typingSpeed);
        }
    }
}

type();
