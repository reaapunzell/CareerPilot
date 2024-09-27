// Event listener for exploring career paths option
document.getElementById("explore-career-paths").addEventListener("click", startConversation);

let conversationStage = 0;
let responses = {};

// Function to start the conversation
function startConversation() {
    document.getElementById("conversation-log").innerHTML = `<p>AI: What subjects are you learning in school?</p>`;
    conversationStage = 1;
}

// Function to handle user responses and advance the conversation
document.getElementById("submit-button").addEventListener("click", function(event) {
    event.preventDefault();
    const userInput = document.getElementById("instructions").value;
    
    if (conversationStage === 1) {
        // Store the subjects learned by the user
        responses.subjects = userInput;
        appendToLog(`You: ${userInput}`);
        appendToLog(`AI: Which subjects do you enjoy the most?`);
        conversationStage = 2;
    } else if (conversationStage === 2) {
        // Store the user's favorite subjects
        responses.favoriteSubjects = userInput;
        appendToLog(`You: ${userInput}`);
        appendToLog(`AI: Do you have any particular skills you're proud of?`);
        conversationStage = 3;
    } else if (conversationStage === 3) {
        // Store the user's skills and finalize the conversation
        responses.skills = userInput;
        appendToLog(`You: ${userInput}`);
        
        // Now send all the collected responses to the AI
        callAIAPI(responses);
    }

    // Clear input field after each submission
    document.getElementById("instructions").value = '';
});

// Function to append text to the conversation log
function appendToLog(message) {
    const log = document.getElementById("conversation-log");
    log.innerHTML += `<p>${message}</p>`;
}

// Function to call the AI API
function callAIAPI(data) {
    const apiKey = "7f9d9cf0474030cet59a45f7coc640b0"; 
    const context = "You are a friendly chatbot for high school students...";
    
    const prompt = `The student is learning: ${data.subjects}. Their favorite subjects are: ${data.favoriteSubjects}. They are proud of the following skills: ${data.skills}. Generate a list of possible career paths they could explore. Put the careers in <h1> elements and the descriptions in <ul><li>.`;
    
    const apiURL = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

    axios.get(apiURL)
        .then(response => {
            displayCareerSuggestions(response.data.answer);
        })
        .catch(error => {
            appendToLog(`AI: Sorry, I couldn't generate career paths at the moment. Please try again later.`);
            console.error(error);
        });
}

// Function to display AI's career suggestions
function displayCareerSuggestions(careers) {
    const log = document.getElementById("conversation-log");
    appendToLog(`AI: Here are some career paths you could explore:`);
    log.innerHTML += `<div>${careers}</div>`; // Assuming the API returns formatted HTML
}
