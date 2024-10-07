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


function filterOptions() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    dropdown.innerHTML = "";

    const filtered = companies.filter((company) => {
        return company.toLowerCase().includes(input);
    })

    filtered.forEach((company) => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = company;
        optionDiv.addEventListener('onclick', () => {
            console.log("hello");
            // document.getElementById('searchInput').value = "helo";
            // closeDropdown();
        });
        dropdown.appendChild(optionDiv);
    });
}

function closeDropdown() {
    dropdown.innerHTML = "";
}