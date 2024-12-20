// Sample data for graph
const sampleData = {
    websites: ["google.com", "yahoo.com", "example.com", "github.com"],
    loadTimes: [1.2, 2.5, 3.0, 0.8] // Load times in seconds
};

// Store the settings data
let settings = {
    storageLocation: "",
    website: "",
    saveLink: false,
    latestDataCount: 5
};

// Function to display the graph popup
document.getElementById('showGraphBtn').addEventListener('click', function() {
    const graphPopup = document.getElementById('graphPopup');
    graphPopup.style.display = 'flex';

    const ctx = document.getElementById('loadTimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampleData.websites,
            datasets: [{
                label: 'Load Time (seconds)',
                data: sampleData.loadTimes,
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
});

// Function to display the settings menu
document.getElementById('settingsBtn').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'flex';
});

// Function to close the settings menu
document.getElementById('closeSettings').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.style.display = 'none';
});

// Open folder picker dialog when user clicks "Browse Folder" button
document.getElementById('browseFolderBtn').addEventListener('click', function() {
    const storageInput = document.getElementById('storageLocation');
    storageInput.click(); // Trigger the folder picker dialog
});

// Function to save settings (store as JSON)
document.getElementById('saveSettings').addEventListener('click', function() {
    const storageLocationInput = document.getElementById('storageLocation');
    const website = document.getElementById('website').value;
    const saveLink = document.getElementById('saveLinkCheckbox').checked;
    const serverSave = document.getElementById('serverCheckbox').checked;
    const latestDataCount = parseInt(document.getElementById('latestDataCount').value, 10);

    // Get selected folder (only accessible when user selects a folder)
    const storageLocation = storageLocationInput.files.length > 0 
        ? storageLocationInput.files[0].webkitRelativePath.split('/')[0] 
        : '';

    if (storageLocation && website && latestDataCount > 0) {
        settings.storageLocation = storageLocation;
        settings.website = website;
        settings.saveLink = saveLink;
        settings.latestDataCount = latestDataCount;
        settings.serverSave = serverSave;

        // Save settings as JSON
        const settingsJson = JSON.stringify(settings);
        downloadFile(settingsJson, 'settings.json');

        alert('Settings saved!');
        document.getElementById('settingsMenu').style.display = 'none';
    } else {
        alert('Please fill in all fields!');
    }
});

// Function to download JSON file
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Function to save load time data
document.getElementById('saveDataBtn').addEventListener('click', function() {
    const data = {
        websites: sampleData.websites,
        loadTimes: sampleData.loadTimes
    };
    downloadFile(JSON.stringify(data), 'load_time_data.json');
});
