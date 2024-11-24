const companies = [
    'Atlassian', 'Morgan Stanley', 'Pinterest', 'Yatra', 'Sumo Logic', 'Google', 'Yandex', 'Bloomreach', 'Clutter',
    'Works Applications', 'Grab', 'Alation', 'Leap Motion', 'Point72', 'Infosys', 'Jingchi', 'Twitch', 'Groupon',
    'Sapient', 'Capital One', 'Kakao', 'Roblox', 'Rackspace', 'Yahoo', 'Paytm', 'Booking.com', 'Alibaba', 'Poshmark',
    'Lyft', 'Jane Street', 'Druva', 'ForUsAll', 'Traveloka', 'Poynt', 'National Instruments', 'GoDaddy', 'Quora',
    'Snapchat', 'Qualcomm', 'InMobi', 'Machine Zone', 'Box', 'McKinsey', 'LiveRamp', 'Square', 'DocuSign', 'Barclays',
    'Twilio', 'LimeBike', 'Citadel', 'AppDynamics', 'Meta', 'Amazon', 'PayPal', 'Thumbtack', 'Two Sigma', 'IIT Bombay',
    'Baidu', 'eBay', 'Intuit', 'GE Digital', 'Cloudera', 'Epic Systems', 'Citrix', 'Aetion', 'Bloomberg', 'Walmart',
    'Arista Networks', 'Apple', 'Netflix', 'Pramp', 'Coupang', 'Valve', 'Coursera', 'TandemG', 'Akuna Capital',
    'MathWorks', 'Triplebyte', 'Uber', 'Symantec', 'Flipkart', 'Blizzard', 'Reddit', 'United Health Group', 'Akuna',
    'Intel', 'NetEase', 'IXL', 'Splunk', 'Twitter', 'ServiceNow', 'Riot Games', 'Flexport', 'Meituan', 'LinkedIn',
    'Nutanix', 'Dataminr', 'C3.ai', 'Pocket Gems', 'Wayfair', 'EMC', 'Tencent', 'Quantcast', 'Huawei', 'Redfin',
    'Airtel', 'Visa', 'Turvo', 'Oracle', 'Qualtrics', 'IBM', 'Honey', 'MAQ Software', 'BlackRock', 'Indeed',
    'Radius', 'ByteDance Toutiao', 'Dell', 'HRT', 'Garena', 'FactSet', 'Fallible', 'Akamai', 'Zoho', 'Cruise Automation',
    'Zulily', 'Palantir', 'Accolite', 'Snapdeal', 'Rubrik', 'Expedia', 'TripAdvisor', 'PhonePe', 'Electronic Arts',
    'Medianet', 'DoorDash', 'Opendoor', 'Gilt Groupe', 'Pure Storage', 'Virtu', 'Pony.ai', 'Arista', 'Dropbox',
    'Tesla', 'Microsoft', 'Adobe', 'Yelp', 'Samsung', 'Airbnb', 'Drawbridge', 'Fidessa', 'Delivery Hero', 'Zillow',
    'Robinhood', 'HBO', 'VMware', 'NVIDIA', 'Postmates', 'Jump Trading', 'NetSuite', 'Zappos', 'Deutsche Bank',
    'American Express', 'Booking', 'Salesforce', 'Asana', 'C3.ai', 'Zenefits', 'Helix', 'Houzz', 'UiPath', 'Affinity',
    'Palantir Technologies', 'Spotify', 'Didi', 'Cisco', 'Affirm', 'Wish', 'Zalando', 'MicroStrategy', 'Zscaler',
    'JPMorgan', 'Hotstar', 'ByteDance', 'DE Shaw', 'Goldman Sachs', 'Audible', 'SAP', 'F5 Networks',
    'Quip', 'Karat', 'Databricks', 'Tableau', 'Hulu', 'Cohesity', 'GSN Games', 'CodeNation'
];

// const backendAPI = "https://jobquest-s251.onrender.com";
const backendAPI = "http://localhost:5000";

const myCompanies = new Set();
const completedQuestions = new Set();
let companyProgressData;
let completedQuestionCount = 0;
let totalQuestionCount = 0;

const dropdown = document.getElementById("dropdown");

// Logic to tell that a selection has been made
const searchBar = document.getElementById("searchInput");
let companySelected = false;

// Logic to close dropdown when user clicks away
document.addEventListener("click", closeDropdown);
searchBar.addEventListener("click", (e) => e.stopPropagation());

function renderCompanyList() {
    const companyList = document.getElementById("companyList");
    companyList.innerHTML = '';
    myCompanies.forEach((company) => {
        // Create a container for each company
        const companyItem = document.createElement('button');
        companyItem.classList.add('company-item');

        // Add the company name
        companyItem.textContent = company;
        companyItem.addEventListener('click', () => removeCompany(company));

        // let totalQuestions = companyProgressData[company]["total-questions"];
        // let remainingQuestions = companyProgressData[company]["remaining-questions"]

        // Show company is completed
        if (companyProgressData[company]["remaining-questions"] == 0) {
            companyItem.classList.add('completed');
        }

        // Append the company block to the list
        companyList.appendChild(companyItem);
    });
}

function checkQuestion(question) {
    completedQuestions.add(question);
    let username = getUsername();
    fetch(`${backendAPI}/complete-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "question": question
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('/complete-question', data);
            companyProgressData = data.companies;
            completedQuestionCount += 1;
            testCompletedQuestions();
            renderCompanyList();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function uncheckQuestion(question) {
    completedQuestions.delete(question);
    let username = getUsername();
    fetch(`${backendAPI}/remove-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "question": question
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('/remove-question', data);
            companyProgressData = data.companies;
            completedQuestionCount -= 1;
            testCompletedQuestions();
            renderCompanyList();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function testCompletedQuestions() {
    const leetcodeList = document.getElementById("leetcodeList");
    const refreshButton = document.getElementById("refreshButton");
    console.log("testCompletedQuestions(): completedQuestionCount", completedQuestionCount);
    refreshButton.classList.toggle('hidden', completedQuestionCount != totalQuestionCount || totalQuestionCount == 0);
    leetcodeList.classList.toggle('completed', completedQuestionCount == totalQuestionCount);
}

function renderLeetcodeList() {
    const user = sessionStorage.getItem("username");
    let leetcodeQuestions = [];
    fetch(`${backendAPI}/common-questions`, {
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
            console.log("/common-questions", data);

            const leetcodeList = document.getElementById("leetcodeList");
            leetcodeList.innerHTML = ''; // Clear the previous list
            completedQuestionCount = 0;
            totalQuestionCount = data.length;

            leetcodeQuestions.forEach((question, idx) => {
                // Create a container for each LeetCode question
                const leetcodeItem = document.createElement('div');
                leetcodeItem.classList.add('question');

                // Add the question header
                const questionHeader = document.createElement('div');
                questionHeader.classList.add('question-header');
                leetcodeItem.appendChild(questionHeader);

                // Add the question name
                const questionName = document.createElement('a');
                questionName.textContent = idx + ". " + question["Title"];
                questionName.href = question["Leetcode Question Link"];
                questionName.target = '_blank'; // opens the link in a new tab
                questionHeader.appendChild(questionName);

                // Add the checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('leetcode-checkbox');
                if (completedQuestions.has(question.Title)) {
                    checkbox.checked = true;
                    completedQuestionCount += 1;
                }

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

                // Add the data
                const questionData = document.createElement('div');
                questionData.classList.add('question-data');

                const companiesWrapper = document.createElement('div');
                companiesWrapper.classList.add('question-companies-wrapper');
                questionData.appendChild(companiesWrapper);

                const companyDataHeader = document.createElement('h3');
                companyDataHeader.innerHTML += `<div>${question["Count"]} companies</div>`;
                companiesWrapper.appendChild(companyDataHeader);

                const companies = document.createElement('div');
                companies.classList.add('question-companies');
                question["Companies"].forEach((c) => {
                    companies.innerHTML += `<div>${c}</div>`;
                });
                companiesWrapper.appendChild(companies);

                const speedo = document.createElement('img');
                speedo.classList.add('question-speedo');
                let commonRatio = question["Companies"].length / myCompanies.size;
                if (commonRatio >= 0.5) {
                    speedo.src = 'images/speedoHigh.png';
                } else if (commonRatio >= 0.33) {
                    speedo.src = 'images/speedoMed.png';
                } else {
                    speedo.src = 'images/speedoLow.png';
                }
                questionData.appendChild(speedo);

                leetcodeItem.appendChild(questionData);

                // Append the question block to the list
                leetcodeList.appendChild(leetcodeItem);
            });

            testCompletedQuestions();
        }
        )
        .catch(error => console.error('Error:', error));
}

function removeCompany(company) {
    myCompanies.delete(company);
    console.log("removeCompany(): myCompanies", myCompanies);
    const user = sessionStorage.getItem("username");
    fetch(`${backendAPI}/update-companies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, companies: Array.from(myCompanies) }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("/update-companies", data);
            renderCompanyList();
            renderLeetcodeList();
        })
        .catch(error => console.error('Error:', error));
}

function updateMyCompanies() {
    const input = document.getElementById("searchInput").value;
    if (companySelected) {
        const user = sessionStorage.getItem("username");
        myCompanies.add(input);
        fetch(`${backendAPI}/update-companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user, companies: Array.from(myCompanies) }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("/update-companies", data);
                companyProgressData = data.companies;
                renderCompanyList();
                renderLeetcodeList();
                document.getElementById("searchInput").value = "";
                companySelected = false;
            })
            .catch(error => console.error('Error:', error));
    }
}

function filterOptions() {
    companySelected = false;
    const input = document.getElementById("searchInput").value.toLowerCase();
    dropdown.innerHTML = "";

    const filtered = companies.filter((company) => {
        return company.toLowerCase().includes(input);
    })

    filtered.forEach(company => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = company;
        optionDiv.addEventListener('click', (e) => {
            document.getElementById('searchInput').value = company;
            companySelected = true;
            e.stopPropagation();
            closeDropdown();
        });
        dropdown.appendChild(optionDiv);
    });

    dropdown.style.display = filtered.length > 0 ? "block" : "none";
}

function closeDropdown() {
    dropdown.style.display = "none";
}

function getUsername() {
    return sessionStorage.getItem("username");
}

function renderTitle() {
    const titleElement = document.getElementById("title");
    let user = getUsername();
    if (user === null) {
        window.location.href = "index.html";
    }
    titleElement.textContent = `${user}'s JobQuest`;
}


// Initializing the page
// renderTitle();

// Initialize my completed questions
fetch(`${backendAPI}/get-questions`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: getUsername() }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("/get-questions", data);
        data.questions.forEach((d) => completedQuestions.add(d));
    })
    .catch(error => console.error('Error:', error));

// Initialize my companies
fetch(`${backendAPI}/get-companies`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: getUsername() }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("/get-companies", data);
        companyProgressData = data.companies;
        for (const key in data["companies"]) {
            myCompanies.add(key);
        }
        renderLeetcodeList();
        renderCompanyList();
    })
    .catch(error => console.error('Error:', error));
