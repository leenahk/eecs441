const companies = ['atlassian','morgan-stanley','pinterest','yatra','sumologic','google','yandex','bloomreach','clutter','works-applications','grab',
'alation','leap-motion','point72','infosys','jingchi','twitch','groupon','sapient','capital-one','kakao','roblox','rackspace','yahoo','paytm',
'bookingcom','alibaba','poshmark','lyft','jane-street','druva','forusall','traveloka','poynt','national-instruments','godaddy','quora','snapchat',
'qualcomm','inmobi','machinezone','box','mckinsey','liveramp','square','docusign','barclays','twilio','limebike','citadel','appdynamics','meta',
'amazon','paypal','thumbtack','two-sigma','iit-bombay','baidu','ebay','intuit','ge-digital','cloudera','epic-systems','citrix','aetion','bloomberg',
'walmart','arista-networks','apple','netflix','pramp','coupang','valve','coursera','tandemg','akuna-capital','mathworks','triplebyte','uber',
'symantec','flipkart','blizzard','reddit','united-health-group','akuna','intel','netease','ixl','splunk','twitter','servicenow','riot-games',
'flexport','meituan','linkedin','nutanix','dataminr','c3-iot','pocket-gems','wayfair','emc','tencent','quantcast','huawei','redfin','airtel',
'visa','turvo','oracle','qualtrics','machine-zone','ibm','honey','maq-software','blackrock','indeed','radius','bytedancetoutiao','dell','hrt',
'garena','factset','fallible','akamai','zoho','cruise-automation','zulily','palantir','accolite','snapdeal','rubrik','expedia','tripadvisor',
'phonepe','electronic-arts','medianet','doordash','opendoor','gilt-groupe','pure-storage','virtu','ponyai','arista','dropbox','tesla','microsoft',
'adobe','yelp','samsung','airbnb','drawbridge','fidessa','deliveryhero','zillow','robinhood','hbo','vmware','nvidia','postmates','jump-trading',
'netsuite','zappos','deutsche-bank','american-express','booking','salesforce','asana','c3ai','zenefits','helix','houzz','uipath','affinity',
'palantir-technologies','spotify','didi','cisco','affirm','wish','zalando','microstrategy','zscaler','jp-morgan-chase','jpmorgan','hotstar',
'bytedance','de-shaw','goldman-sachs','audible','sap','f5-networks','quip','karat','databricks','tableau','hulu','cohesity','gsn-games','codenation']

const myCompanies = new Set();
const completedQuestions = new Set();
let companyProgressData;

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
        const companyItem = document.createElement('div');
        companyItem.classList.add('company-item');
        companyItem.classList.add('list-item');

        // Add the company name
        const companyName = document.createElement('span');
        let totalQuestions = companyProgressData[company]["total-questions"];
        let remainingQuestions = companyProgressData[company]["remaining-questions"]
        companyName.textContent = company +
            ` (${companyProgressData[company]["remaining-questions"]} of 
            ${totalQuestions})`;
        companyItem.appendChild(companyName);


        // Show company is completed
        if (companyProgressData[company]["remaining-questions"] == 0) {
            companyItem.classList.add('completed');
            const completedText = document.createElement('span');
            completedText.textContent = 'Completed!';
            completedText.classList.add('completed-text');
            companyItem.appendChild(completedText);
        }

        // Add the trash icon
        const trashIcon = document.createElement('span');
        trashIcon.innerHTML = '🗑️';  // Using a trash emoji for the icon
        trashIcon.classList.add('trash-icon');
        trashIcon.addEventListener('click', () => removeCompany(company));
        companyItem.appendChild(trashIcon);

        // Append the company block to the list
        companyList.appendChild(companyItem);
    });
}

function checkQuestion(question) {
    completedQuestions.add(question);
    let username = getUsername();
    fetch('http://localhost:5000/complete-question', {
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function uncheckQuestion(question) {
    completedQuestions.delete(question);
    let username = getUsername();
    fetch('http://localhost:5000/remove-question', {
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function renderLeetcodeList() {
    const user = sessionStorage.getItem("username");
    let leetcodeQuestions = [];
    fetch('http://localhost:5000/common-questions', {
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

            let leetcodeList = document.getElementById("leetcodeList");
            leetcodeList.innerHTML = ''; // Clear the previous list

            leetcodeQuestions.forEach((question) => {
                // Create a container for each LeetCode question
                const leetcodeItem = document.createElement('div');
                leetcodeItem.classList.add('leetcode-item');
                leetcodeItem.classList.add('list-item');

                // Add the question name
                const questionName = document.createElement('span');
                questionName.textContent = question.Title;
                leetcodeItem.appendChild(questionName);

                // Add the checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('leetcode-checkbox');
                checkbox.checked = completedQuestions.has(question.Title);
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        console.log(question.Title, 'is checked!');
                        checkQuestion(question.Title);
                    } else {
                        uncheckQuestion(question.Title);
                    }
                });
                leetcodeItem.appendChild(checkbox);

                // Append the question block to the list
                leetcodeList.appendChild(leetcodeItem);
            });
        }
        )
        .catch(error => console.error('Error:', error));
}

function removeCompany(company) {
    myCompanies.delete(company);
    const user = sessionStorage.getItem("username");
    fetch('http://localhost:5000/update-companies', {
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
        console.log(Array.from(myCompanies));
        fetch('http://localhost:5000/update-companies', {
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
renderTitle();

// Initialize my companies
fetch('http://localhost:5000/get-companies', {
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

// Initialize my completed questions
fetch('http://localhost:5000/get-questions', {
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
        console.log("completedQuestions", completedQuestions);
        renderLeetcodeList();
        renderCompanyList();
    })
    .catch(error => console.error('Error:', error));