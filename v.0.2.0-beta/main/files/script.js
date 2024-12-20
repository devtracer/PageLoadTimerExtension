// Declare sampleData globally to be accessible
let sampleData = {
    websites: [],
    loadTimes: []
};



// Function to retrieve load time data from local storage and format it for the graph
function getGraphData() {
    chrome.storage.local.get("data", function(result) {
        const websites = [];
        const loadTimes = [];

        chrome.storage.local.get('settings', function(result) {
            const settings_entry = result.settings || { Settings: "" };
        });

        // Iterate through stored data and format
        if (result.data) {
            result.data.forEach(item => {
                websites.push(item.url || ""); // If no URL, add an empty string
                loadTimes.push(item.loadTime); // Assuming loadTime is already a number
            });
        }

        // Update sampleData for the graph
        sampleData = {
            websites: websites,
            loadTimes: loadTimes
            settings: settings_entry
        };

        console.log(sampleData);  // Log the data (or use it for graphing purposes)
    });
}

// Call the function to get and format the data for the graph
getGraphData();

// Global variable to store the chart instance
let myChart = null;

// Function to display the graph popup
document.getElementById('showGraphBtn').addEventListener('click', function() {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'flex';

    const ctx = document.getElementById('loadTimeChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampleData.websites,
            datasets: [{
                label: 'Load Time (seconds)',
                data: sampleData.loadTimes.map(time => (time / 1000).toFixed(2)), // Convert to seconds here
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Function to close the graph popup
document.getElementById('closeGraph').addEventListener('click', function() {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'none';

    // Destroy the chart instance when closing the popup
    if (myChart) {
        myChart.destroy();
        myChart = null; // Clear the chart reference
    }
});

// Function to display the settings menu
document.getElementById('settingsBtn').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'flex';
    
    // Load settings from chrome.storage.local and populate the form
    chrome.storage.local.get('settings', function(result) {
        const settings = result.settings || {};
        
        // Populate the fields with saved settings
        document.getElementById('website').value = settings.website || '';
        document.getElementById('saveLinkCheckbox').checked = settings.saveLink || false;
        document.getElementById('serverCheckbox').checked = settings.serverSave || false;
        document.getElementById('latestDataCount').value = settings.latestDataCount || '';
    });
});

// Function to close the settings menu
document.getElementById('closeSettings').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'none';
});

// Save settings to chrome.storage.local
document.getElementById('saveSettings').addEventListener('click', function () {
    const website = document.getElementById('website').value;
    const saveLink = document.getElementById('saveLinkCheckbox').checked;
    const serverSave = document.getElementById('serverCheckbox').checked;
    const latestDataCount = parseInt(document.getElementById('latestDataCount').value, 10);

    if (website && latestDataCount > 0) {
        const settings = {
            website: website,
            saveLink: saveLink,
            latestDataCount: latestDataCount,
            serverSave: serverSave
        };

        // Save settings to chrome.storage.local
        chrome.storage.local.set({settings: settings}, function() {
            alert('Settings saved!');
            document.getElementById('settingsMenu').style.display = 'none';
        });
    } else {
        alert('Please fill in all fields!');
    }
});

// Helper function to trigger file download
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Function to save load time data and settings
document.getElementById('saveDataBtn').addEventListener('click', function() {
    // Get settings from chrome.storage.local
    chrome.storage.local.get('settings', function(result) {
        const settings = result.settings || { Settings: "" };

        // Prepare the data object including settings
        const data = {
            websites: sampleData.websites,
            loadTimes: sampleData.loadTimes,
            settings: settings
        };

        // Print the data to the console
        console.log("Data to be saved:", data);

        // Trigger file download for load time data
        downloadFile(JSON.stringify(data), 'analyse.json');
    });
});
