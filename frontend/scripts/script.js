const companies = [
    'Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook', 'Tesla', 'Intel', 'IBM', 'Oracle', 'Cisco',
    'Adobe', 'Salesforce', 'NVIDIA', 'Netflix', 'Samsung', 'Qualcomm', 'HP', 'Dell', 'Spotify', 'Slack',
    'Zoom', 'Snap', 'Twitter', 'Reddit', 'Pinterest', 'Shopify', 'Dropbox', 'GitHub', 'Stripe', 'PayPal',
    'Square', 'Uber', 'Lyft', 'Airbnb', 'eBay', 'Baidu', 'Tencent', 'Alibaba', 'Huawei', 'Xiaomi',
    'ZTE', 'Lenovo', 'Toshiba', 'ASUS', 'LG', 'AMD', 'Western Digital', 'VMware', 'SpaceX', 'Palantir',
    'Epic Games', 'Unity Technologies', 'Electronic Arts', 'Activision Blizzard', 'Zynga', 'LinkedIn',
    'Yelp', 'Twitch', 'Bumble', 'Instacart', 'DoorDash', 'Robinhood', 'Coinbase', 'Squarespace', 'WeWork',
    'Cloudflare', 'Databricks', 'Snowflake', 'Roku', 'Sonos', 'Ring', 'GoPro', 'Vimeo', 'MongoDB',
    'Atlassian', 'DocuSign', 'Twilio', 'Okta', 'Workday', 'ServiceNow', 'HubSpot', 'ZoomInfo', 'Bitdefender',
    'CrowdStrike', 'Fortinet', 'McAfee', 'NortonLifeLock', 'Verizon', 'AT&T', 'T-Mobile', 'Intellicheck',
    'Splunk', 'Elastic', 'Cloudera', 'Dropbox', 'Box', 'Fastly', 'Hootsuite', 'Buffer', 'Canva', 'Trello',
    'Miro', 'Notion', 'Figma', 'Zapier', 'IFTTT', 'Wix'
];

let leetcodeQuestions = [
    'Two Sum', 'Longest Substring Without Repeating Characters', 'Median of Two Sorted Arrays',
    'Merge Two Sorted Lists', 'Best Time to Buy and Sell Stock'
];

const myCompanies = new Set();

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
        companyName.textContent = company;
        companyItem.appendChild(companyName);

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

function renderLeetcodeList() {
    let leetcodeList = document.getElementById("leetcodeList");
    leetcodeList.innerHTML = ''; // Clear the previous list

    leetcodeQuestions.forEach((question) => {
        // Create a container for each LeetCode question
        const leetcodeItem = document.createElement('div');
        leetcodeItem.classList.add('leetcode-item');
        leetcodeItem.classList.add('list-item');

        // Add the question name
        const questionName = document.createElement('span');
        questionName.textContent = question;
        leetcodeItem.appendChild(questionName);

        // Add the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('leetcode-checkbox');
        leetcodeItem.appendChild(checkbox);

        // Append the question block to the list
        leetcodeList.appendChild(leetcodeItem);
    });
}

function removeCompany(company) {
    myCompanies.delete(company);
    renderCompanyList();
}

function updateMyCompanies() {
    const input = document.getElementById("searchInput").value;
    if (companySelected) {
        myCompanies.add(input);
        renderCompanyList();
        document.getElementById("searchInput").value = "";
        companySelected = false;
    }
}

function filterOptions() {
    companySelected = false;
    const input = document.getElementById("searchInput").value.toLowerCase();
    dropdown.innerHTML = "";

    const filtered = companies.filter((company) => {
        return company.toLowerCase().includes(input);
    })

    filtered.forEach((company) => {
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
    const titleElement = document.getElementById("title");
    const user = sessionStorage.getItem("username");
    if (user === null) {
        window.location.href = "index.html";
    }
    titleElement.textContent = `${user}'s JobQuest`;
}

getUsername();
renderLeetcodeList();