<script>
// Replace with your Discord webhook URL
var discordWebhookUrl = 'https://discord.com/api/webhooks/1257917892608131123/PY5PDPSgAG6PeInl8gcE-SjAJxIOL8jExfdFNbggTlSfZJCmnpmy5B5KCIgL0o5HLPzy';

document.addEventListener('DOMContentLoaded', function() {
    var pagePath = window.location.pathname;

    // Fetch visitor's IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ip = data.ip;
            sendNotification(pagePath, getBrowser(), getDeviceDetails(), ip, getUsername(), getScreenInfo(), getLanguage(), getTimezone());
        })
        .catch(error => console.error('Error fetching visitor IP:', error));

    // Handle visit count
    var visitCount = localStorage.getItem('visitCount') || 0;
    var totalVisits = localStorage.getItem('totalVisits') || 0;

    // Increase visit counts
    visitCount++;
    totalVisits++;

    localStorage.setItem('visitCount', visitCount);
    localStorage.setItem('totalVisits', totalVisits);

    // Prepare and display visit count message
    var visitCountMessage = 'Number of visits to this page: ' + visitCount;
    var totalVisitsMessage = 'Total visits to the website: ' + totalVisits;

    var visitCountElement = document.createElement('p');
    visitCountElement.textContent = visitCountMessage;

    var totalVisitsElement = document.createElement('p');
    totalVisitsElement.textContent = totalVisitsMessage;

    // Add the visit count messages to the page
    document.body.appendChild(visitCountElement);
    document.body.appendChild(totalVisitsElement);
});

function getDeviceDetails() {
    var userAgent = navigator.userAgent;
    var os = 'Unknown OS';
    var type = 'Unknown Device';
    var architecture = 'Unknown Architecture';

    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    if (userAgent.indexOf('Android') !== -1) os = 'Android';
    if (userAgent.indexOf('like Mac') !== -1) os = 'iOS';

    if (userAgent.indexOf('Android') !== -1) type = 'Mobile';
    if (userAgent.indexOf('iPhone') !== -1) type = 'Mobile';
    if (userAgent.indexOf('iPad') !== -1) type = 'Tablet';
    if (userAgent.indexOf('Mac') !== -1 || userAgent.indexOf('Win') !== -1 || userAgent.indexOf('Linux') !== -1) type = 'PC';

    if (navigator.userAgent.indexOf('WOW64') !== -1 || navigator.userAgent.indexOf('Win64') !== -1) architecture = '64 bit';
    else if (navigator.userAgent.indexOf('Win32') !== -1 || navigator.userAgent.indexOf('WOW32') !== -1) architecture = '32 bit';

    return { os: os, type: type, architecture: architecture };
}

function getBrowser() {
    var userAgent = navigator.userAgent;
    var browserName = 'Unknown';

    if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
    } else if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browserName = 'Opera';
    } else if (userAgent.indexOf('Edg') > -1) {
        browserName = 'Edge';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
        browserName = 'Internet Explorer';
    }

    return browserName;
}

function getScreenInfo() {
    return `Width: ${window.screen.width}, Height: ${window.screen.height}, Color Depth: ${window.screen.colorDepth}`;
}

function getLanguage() {
    return navigator.language || navigator.userLanguage;
}

function getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function sendNotification(pagePath, browser, deviceDetails, ip, username, screenInfo, language, timezone) {
    var timestamp = new Date();
    var date = timestamp.toLocaleDateString();
    var time = timestamp.toLocaleTimeString();

    // Prepare Embed message
    var payload = {
        embeds: [{
            title: '🔔 New Visitor Notification',
            description: '**__A new visit has been recorded by__** **``' + username + '``**.',
            fields: [
                { name: 'Page Path:', value: pagePath, inline: true },
                { name: 'Visit Date:', value: date, inline: true },
                { name: 'Visit Time:', value: time, inline: true },
                { name: 'Browser:', value: browser, inline: true },
                { name: 'Operating System:', value: deviceDetails.os, inline: true },
                { name: 'Device Type:', value: deviceDetails.type, inline: true },
                { name: 'Architecture:', value: deviceDetails.architecture, inline: true },
                { name: 'Visitor IP:', value: ip, inline: true },
                { name: 'Visit Count:', value: visitCount, inline: true },
                { name: 'Username:', value: username, inline: true },
                { name: 'Language:', value: language, inline: true },
                { name: 'Timezone:', value: timezone, inline: true },
                { name: 'Screen Info:', value: '```' + screenInfo + '```', inline: true }, // Screen Info as code block for better formatting
                { name: '\u200B', value: '\u200B', inline: false }, // Empty field for spacing
                { name: 'Total Visits:', value: totalVisits, inline: true }
            ],
            color: 16711680 // Red color
        }]
    };

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    fetch(discordWebhookUrl, options)
        .then(response => console.log('Notification sent to Discord:', response))
        .catch(error => console.error('Error sending notification to Discord:', error));
}

function getUsername() {
    var storedUsername = localStorage.getItem('username');
    return storedUsername ? storedUsername : 'Guest';
}
</script>
