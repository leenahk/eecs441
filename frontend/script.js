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

const dropdown = document.getElementById("dropdown");
const searchBar = document.getElementById("searchInput");

/*
 * Filter the options in the dropdown based on what user has
 * typed inside the search bar.
 */
function filterOptions() {
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
            e.stopPropagation();
            closeDropdown();
        });
        dropdown.appendChild(optionDiv);
    });
    
    dropdown.style.display = "block";
}

function closeDropdown() {
    dropdown.style.display = "none";
}

// Logic to close dropdown when user clicks away
document.addEventListener("click", closeDropdown);
searchBar.addEventListener("click", (e) => e.stopPropagation());