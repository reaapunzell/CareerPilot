// Event listener for exploring career paths option
document.getElementById("explore-career-paths").addEventListener("click", handleOptionSelection);

let conversationStage = 0;
let responses = {};

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

document.getElementById("exit-button").addEventListener("click", function() {
    const chatOptions = document.querySelector(".chat-options-container");
    chatOptions.style.display = "block"; // Show the chat options again
    const log = document.getElementById("conversation-log");
    log.innerHTML = ''; // Clear the conversation log if you want to reset it
}); 

function handleOptionSelection(option) {
    selectedOption = option;
    const chatOptions = document.querySelector(".chat-options-container");
    chatOptions.style.display = "none"; // Hide options once one is selected

    if (option === "Explore Career Paths") {
        appendToLog("What are your favorite school subjects?");
        conversationStage = 1;
    } else if (option === "In-Demand Skills") {
        appendToLog("Would you like to see in-demand skills for all fields or a specific career path?");
        conversationStage = 4;
    } else if (option === "Study Program Guidance") {
        appendToLog("Would you prefer studying locally or abroad?");
        conversationStage = 6;
    } else if (option === "Ask a General Question") {
        appendToLog("Please type your question below:");
        conversationStage = 8;
    }
}

// Function to handle user responses and advance the conversation
document.getElementById("submit-button").addEventListener("click", function(event) {
    event.preventDefault();
    const userInput = document.getElementById("instructions").value;

    if (conversationStage === 1) {
        responses.subjects = userInput;
        appendToLog(userInput, "user");
        appendToLog("What are your interests and hobbies?");
        conversationStage = 2;
    } else if (conversationStage === 2) {
        responses.interests = userInput;
        appendToLog(userInput, "user");
        appendToLog("Do you have any particular skills you're proud of?");
        conversationStage = 3;
    } else if (conversationStage === 3) {
        responses.skills = userInput;
        appendToLog(userInput, "user");
        callAIAPI(responses, 'career-paths');
    } else if (conversationStage === 4) {
        responses.skillFocus = userInput;
        appendToLog(userInput, "user");
        callAIAPI(responses, 'in-demand-skills');
    } else if (conversationStage === 6) {
        responses.studyPreference = userInput;
        appendToLog(userInput, "user");
        appendToLog("Are you interested in a university degree, a technical diploma, or an online course?");
        conversationStage = 7;
    } else if (conversationStage === 7) {
        responses.studyType = userInput;
        appendToLog(userInput, "user");
        callAIAPI(responses, 'study-guidance');
    } else if (conversationStage === 8) {
        responses.generalQuestion = userInput;
        appendToLog(userInput, "user");
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

    console.log(`Calling AI API with URL: ${apiURL}`); // Log the API call

    axios.get(apiURL)
        .then(response => {
            console.log('API Response:', response.data); // Log the response data
            displayAIResponse(response.data.answer);
        })
        .catch(error => {
            appendToLog("Sorry, I couldn't generate career paths at the moment. Please try again later.", "ai");
            console.error(error);
        });
}

// Function to display AI's career suggestions
function displayAIResponse(response) {
    const suggestions = response.split(/\d+\.\s/).filter(suggestion => suggestion); // Splitting by numbers

    let formattedResponse = "<p>That's awesome! If you're strong in math and interested in it, there are plenty of exciting career paths you might consider. Here are some suggestions:</p>";

    suggestions.forEach(suggestion => {
        const parts = suggestion.split(":"); // Split each suggestion into title and description

        if (parts.length === 2) {
            const title = parts[0].trim(); // Extract the title
            const description = parts[1].trim(); // Extract the description
            formattedResponse += `<h2>${title}</h2><p>${description}</p>`; // Format as heading and paragraph
        }
    });

    appendToLog(formattedResponse, "ai");
}

// User info submission
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
    .then(response => {
        console.log('User submission response:', response); // Log the response object
        return response.json(); // Return the JSON response
    })
    .then(data => {
        if (data.success) {
            alert("User information saved successfully!");

            // Hide user info form and show the chat container
            document.getElementById('user-info-form').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
            
            // Update the greeting message
            document.getElementById('greeting').innerHTML = `Hi ${name}, what career-related questions do you have today?`;
            document.getElementById('username').innerHTML = `${name}`;

            // Fetch users after successful user addition
            

            document.getElementById("see-profile").addEventListener("click", async function() {
                try {
                    const users = await fetchData();
                    const username = document.getElementById("username").textContent;

                    const user = users.find(user => user.name === username);
                
                    if (user) {
                        document.getElementById("profile-name").textContent = user.name;
                        document.getElementById("profile-email").textContent = user.email;
                        document.getElementById("profile-age").textContent = user.age;
                
                        document.getElementById("profile-info").style.display = "block";
                    } else {
                        console.error("User not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            });
        } else {
            alert("Failed to save user information.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

// Fetch user data function
function fetchData() {
    try {
        const response =  fetch('http://localhost:3000/users');
        const data = response.json();
        console.log('Fetched user data:', data);
        return data; // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        return []; // Return an empty array in case of error
    }
}
