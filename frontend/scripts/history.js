// const backendAPI = "https://jobquest-s251.onrender.com";
const backendAPI = "http://localhost:5000";
const user = sessionStorage.getItem("username");

function checkQuestion(question) {
    fetch(`${backendAPI}/complete-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": user,
            "question": question
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('/complete-question', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function uncheckQuestion(question) {
    fetch(`${backendAPI}/remove-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": user,
            "question": question
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('/remove-question', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function renderLeetcodeList() {
    let leetcodeQuestions = [];
    fetch(`${backendAPI}/completed-questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            leetcodeQuestions = data;
            console.log("/completed-questions", data);

            const leetcodeList = document.getElementById("leetcodeList");
            leetcodeList.innerHTML = ''; // Clear the previous list
            completedQuestionCount = 0;
            totalQuestionCount = data.questions.length;

            leetcodeQuestions.questions.forEach((question) => {
                // Create a container for each LeetCode question
                const leetcodeItem = document.createElement('div');
                leetcodeItem.classList.add('question');

                // Add the question header
                const questionHeader = document.createElement('div');
                questionHeader.classList.add('question-header');
                leetcodeItem.appendChild(questionHeader);

                // Add the question name
                const questionName = document.createElement('a');
                questionName.textContent = question["Title"];
                questionName.href = question["Leetcode Question Link"];
                questionName.target = '_blank'; // opens the link in a new tab
                questionHeader.appendChild(questionName);

                // Add the checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('leetcode-checkbox');
                checkbox.checked = true;

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        checkQuestion(question.Title);
                    } else {
                        uncheckQuestion(question.Title);
                    }
                });
                leetcodeItem.appendChild(checkbox);

                // Add the difficulty
                const difficulty = document.createElement('div');
                difficulty.classList.add('question-difficulty');
                difficulty.textContent = question["Difficulty"];
                if (question["Difficulty"] == "Easy") {
                    difficulty.style.color = "#048147";
                } else if (question["Difficulty"] == "Medium") {
                    difficulty.style.color = "#B88700";
                } else {
                    difficulty.style.color = "#B3261E";
                }
                leetcodeItem.appendChild(difficulty);

                // Append the question block to the list
                leetcodeList.appendChild(leetcodeItem);
            });
        }
        )
        .catch(error => console.error('Error:', error));
}

renderLeetcodeList();