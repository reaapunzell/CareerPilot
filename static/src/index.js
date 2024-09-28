// Event listener for exploring career paths option
document.getElementById("explore-career-paths").addEventListener("click", handleOptionSelection);

let conversationStage = 0;
let responses = {};

// Function to start the conversation
// Add event listeners for all options
document.getElementById("explore-career-paths").addEventListener("click", function() {
    handleOptionSelection("Explore Career Paths");
});

document.getElementById("in-demand-skills").addEventListener("click", function() {
    handleOptionSelection("In-Demand Skills");
});

document.getElementById("study-program-guidance").addEventListener("click", function() {
    handleOptionSelection("Study Program Guidance");
});

document.getElementById("ask-general-question").addEventListener("click", function() {
    handleOptionSelection("Ask a General Question");
});
 
document.getElementById("exit-button").addEventListener("click", function(){
    window.location.href = "index.html";
})
function handleOptionSelection(option) {
    selectedOption = option;
    const chatOptions = document.querySelector(".chat-options-container");
    chatOptions.style.display = "none"; // Hide options once one is selected

    if (option === "Explore Career Paths") {
        appendToLog(`What are your favorite school subjects?`);
        conversationStage = 1;
    } else if (option === "In-Demand Skills") {
        appendToLog(`Would you like to see in-demand skills for all fields or a specific career path?`);
        conversationStage = 4;
    } else if (option === "Study Program Guidance") {
        appendToLog(`Would you prefer studying locally or abroad?`);
        conversationStage = 6;
    } else if (option === "Ask a General Question") {
        appendToLog(`Please type your question below:`);
        conversationStage = 8;
    }
}

// Function to handle user responses and advance the conversation
document.getElementById("submit-button").addEventListener("click", function(event) {
    event.preventDefault();
    const userInput = document.getElementById("instructions").value;

    if (conversationStage === 1) {
        responses.subjects = userInput;
        appendToLog(`${userInput}`, "user");
        appendToLog(`What are your interests and hobbies?`);
        conversationStage = 2;
    } else if (conversationStage === 2) {
        responses.interests = userInput;
        appendToLog(`${userInput}`, "user");
        appendToLog(`Do you have any particular skills you're proud of?`);
        conversationStage = 3;
    } else if (conversationStage === 3) {
        responses.skills = userInput;
        appendToLog(`${userInput}`, "user");
        callAIAPI(responses, 'career-paths');
    } else if (conversationStage === 4) {
        responses.skillFocus = userInput;
        appendToLog(`${userInput}`, "user");
        callAIAPI(responses, 'in-demand-skills');
    } else if (conversationStage === 6) {
        responses.studyPreference = userInput;
        appendToLog(`${userInput}`, "user");
        appendToLog(`Are you interested in a university degree, a technical diploma, or an online course?`);
        conversationStage = 7;
    } else if (conversationStage === 7) {
        responses.studyType = userInput;
        appendToLog(`${userInput}`, "user");
        callAIAPI(responses, 'study-guidance');
    } else if (conversationStage === 8) {
        responses.generalQuestion = userInput;
        appendToLog(`${userInput}`, "user");
        callAIAPI(responses, 'general-question');
    }

    // Clear input field after submission
    document.getElementById("instructions").value = '';
});

// Function to append text to the conversation log
function appendToLog(message, sender = "ai") {
    const log = document.getElementById("conversation-log");

    // Create a new message div and apply sender-specific class
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    // Add the message content
    messageDiv.innerHTML = `<p>${message}</p>`;
    log.appendChild(messageDiv);

    // Scroll to the bottom of the conversation log
    log.scrollTop = log.scrollHeight;
}

// Function to call the AI API
function callAIAPI(data, type) {
    const apiKey = "7f9d9cf0474030cet59a45f7coc640b0"; 
    const context = "You are a friendly chatbot for high school students...";
    let prompt = "";

    if (type === 'career-paths') {
        prompt = `The student is learning: ${data.subjects}. They are interested in: ${data.interests}, and they have skills in: ${data.skills}. Suggest some career paths.`;
    } else if (type === 'in-demand-skills') {
        prompt = `Provide a list of in-demand skills for: ${data.skillFocus}.`;
    } else if (type === 'study-guidance') {
        prompt = `The user prefers studying ${data.studyPreference} and is interested in ${data.studyType}. Suggest some study programs.`;
    } else if (type === 'general-question') {
        prompt = `Answer the following question: ${data.generalQuestion}`;
    }

    const apiURL = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

    axios.get(apiURL)
        .then(response => {
            displayAIResponse(response.data.answer);
        })
        .catch(error => {
            appendToLog(`Sorry, I couldn't generate career paths at the moment. Please try again later.`, "ai");
            console.error(error);
        });
}

// Function to display AI's career suggestions
function displayAIResponse(response) {
    appendToLog(`${response}`, "ai")
 
}

//adding users to database 

document.getElementById('submit-user-info').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    // Basic validation
    if (!name || !email || !age) {
        alert("Please fill out all fields.");
        return;
    }

    // Prepare user data
    const userData = {
        name: name,
        email: email,
        age: age
    };

    // Send user data to backend using fetch API
    fetch('http://localhost:3000/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User information saved successfully!");
            // Hide user info form and show the chat container
            document.getElementById('user-info-form').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
        } else {
            alert("Failed to save user info. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
});
