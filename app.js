// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Init WebApp features
tg.expand();

// Handle theme changes
function applyTelegramTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1F1F1F');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#FFFFFF');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2AABEE');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#FFFFFF');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#272727');
}

// Apply theme on load
applyTelegramTheme();

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Sample data for demonstration
const sampleCollections = [
    {
        id: 1,
        name: 'Premium Collection',
        image: 'https://via.placeholder.com/150',
        giftsCount: 5,
        price: 10,
        type: 'Premium'
    },
    {
        id: 2,
        name: 'Special Edition',
        image: 'https://via.placeholder.com/150',
        giftsCount: 3,
        price: 5,
        type: 'Standard'
    }
];

// When the create collection button is clicked
document.querySelector('.create-button').addEventListener('click', () => {
    // Here we would normally open a form or dialog
    // For now, let's just send a message back to the bot
    tg.sendData(JSON.stringify({
        action: 'create_collection'
    }));
});

// When a view button is clicked
document.querySelectorAll('.view-button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const collectionId = sampleCollections[index]?.id || 0;
        
        // Send data to the bot about which collection was viewed
        tg.sendData(JSON.stringify({
            action: 'view_collection',
            collection_id: collectionId
        }));
    });
});

// Deposit button click
document.querySelector('.deposit-button').addEventListener('click', () => {
    tg.sendData(JSON.stringify({
        action: 'deposit'
    }));
});

// Withdraw button click
document.querySelector('.withdraw-button').addEventListener('click', () => {
    tg.sendData(JSON.stringify({
        action: 'withdraw'
    }));
});
