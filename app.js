// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// DOM Elements
const cartCount = document.getElementById('cart-count');
const giftGrid = document.getElementById('gift-grid');
const balanceAmount = document.getElementById('balance-amount');
const walletAddress = document.getElementById('wallet-address');
const userAvatar = document.getElementById('user-avatar').querySelector('img');
const addFundsBtn = document.getElementById('add-funds-btn');
const subtractFundsBtn = document.getElementById('subtract-funds-btn');

// Navigation tabs
const marketTab = document.getElementById('market-tab');
const myCollectionsTab = document.getElementById('my-collections-tab');
const addCollectionTab = document.getElementById('add-collection-tab');
const myGiftsTab = document.getElementById('my-gifts-tab');

// Sample data for gifts
const gifts = [
    {
        id: 1,
        name: "Easter Egg",
        gifId: "#114748",
        price: 4.4,
        image: "https://via.placeholder.com/300/9c27b0/FFFFFF?text=Easter+Egg",
        background: "#9c27b0"
    },
    {
        id: 2,
        name: "Easter Egg",
        gifId: "#104709",
        price: 3.96,
        image: "https://via.placeholder.com/300/e67e22/FFFFFF?text=Easter+Egg",
        background: "#e67e22"
    },
    {
        id: 3,
        name: "Easter Egg",
        gifId: "#103456",
        price: 4102.45,
        image: "https://via.placeholder.com/300/8bc34a/FFFFFF?text=Easter+Egg",
        background: "#8bc34a"
    },
    {
        id: 4,
        name: "Easter Egg",
        gifId: "#109876",
        price: 25.75,
        image: "https://via.placeholder.com/300/e74c3c/FFFFFF?text=Easter+Egg",
        background: "#e74c3c"
    }
];

// Sample collections data
const collections = [
    {
        id: 101,
        name: "Birthday Collection",
        totalPrice: 45.5,
        giftCount: 3,
        image: "https://via.placeholder.com/300/3498db/FFFFFF?text=Birthday"
    },
    {
        id: 102,
        name: "Silver Collection",
        totalPrice: 120.75,
        giftCount: 5,
        image: "https://via.placeholder.com/300/bdc3c7/FFFFFF?text=Silver"
    }
];

// My gifts data
const myGifts = [
    {
        id: 201,
        name: "Premium Gift",
        gifId: "#205678",
        price: 7.25,
        image: "https://via.placeholder.com/300/9b59b6/FFFFFF?text=Premium+Gift"
    },
    {
        id: 202,
        name: "Special Package",
        gifId: "#207890",
        price: 12.40,
        image: "https://via.placeholder.com/300/2ecc71/FFFFFF?text=Special+Package"
    }
];

// Cart
let cart = [];

// User balance (would be fetched from the bot)
let userBalance = 1.394;

// Current view
let currentView = 'market';

// Initialize the app
function initApp() {
    // Set initial balance
    updateBalance(userBalance);
    
    // Set user info if available from Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        
        if (user.username) {
            // Get first part of wallet address (username)
            const displayName = user.username.length > 8 
                ? user.username.substring(0, 4) + '...' + user.username.substring(user.username.length - 4) 
                : user.username;
            walletAddress.querySelector('span').textContent = displayName;
        }
        
        // Set avatar if available
        if (user.photo_url) {
            userAvatar.src = user.photo_url;
        }
    }
    
    // Initial view - Market
    showMarketView();
    
    // Add event listeners
    addEventListeners();
}

// Update balance display
function updateBalance(balance) {
    userBalance = balance;
    balanceAmount.textContent = balance.toFixed(3);
}

// Show Market view (all gifts)
function showMarketView() {
    currentView = 'market';
    updateActiveTab();
    
    // Clear grid
    giftGrid.innerHTML = '';
    
    // Add gift cards
    gifts.forEach(gift => {
        const giftCard = createGiftCard(gift);
        giftGrid.appendChild(giftCard);
    });
}

// Show My Collections view
function showMyCollectionsView() {
    currentView = 'myCollections';
    updateActiveTab();
    
    // Clear grid
    giftGrid.innerHTML = '';
    
    // Add collection cards
    collections.forEach(collection => {
        const collectionCard = createCollectionCard(collection);
        giftGrid.appendChild(collectionCard);
    });
}

// Show Add Collection view
function showAddCollectionView() {
    currentView = 'addCollection';
    updateActiveTab();
    
    // Clear grid
    giftGrid.innerHTML = '';
    
    // Add "Add Collection" UI
    const addCollectionUI = document.createElement('div');
    addCollectionUI.className = 'add-collection-container';
    addCollectionUI.innerHTML = `
        <div class="info-message">
            <h3>Add Your Collection</h3>
            <p>Create a new collection to showcase or sell your gifts.</p>
        </div>
        <button class="action-button">
            <i class="fas fa-plus"></i> Create New Collection
        </button>
    `;
    
    giftGrid.appendChild(addCollectionUI);
    
    // Add event listener for create button
    const createButton = addCollectionUI.querySelector('.action-button');
    createButton.addEventListener('click', () => {
        // Send data to bot to initiate collection creation
        sendDataToBot({
            action: 'create_collection'
        });
    });
}

// Show My Gifts view
function showMyGiftsView() {
    currentView = 'myGifts';
    updateActiveTab();
    
    // Clear grid
    giftGrid.innerHTML = '';
    
    // Add gift cards for my gifts
    myGifts.forEach(gift => {
        const giftCard = createGiftCard(gift, true);
        giftGrid.appendChild(giftCard);
    });
}

// Update active tab in the bottom navigation
function updateActiveTab() {
    // Remove active class from all tabs
    document.querySelectorAll('.nav-item').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to current tab
    switch(currentView) {
        case 'market':
            marketTab.classList.add('active');
            break;
        case 'myCollections':
            myCollectionsTab.classList.add('active');
            break;
        case 'addCollection':
            addCollectionTab.classList.add('active');
            break;
        case 'myGifts':
            myGiftsTab.classList.add('active');
            break;
    }
}

// Create a gift card element
function createGiftCard(gift, isMyGift = false) {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.setAttribute('data-id', gift.id);
    
    card.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" class="gift-image">
        <div class="gift-buttons">
            <button class="gift-btn gift-info-btn" data-id="${gift.id}">
                <i class="fas fa-gift"></i>
            </button>
            ${isMyGift ? 
                `<button class="gift-btn gift-return-btn" data-id="${gift.id}">
                    <i class="fas fa-undo"></i>
                </button>` : 
                `<button class="gift-btn add-to-cart-btn" data-id="${gift.id}">
                    <i class="fas fa-cart-plus"></i>
                </button>`
            }
        </div>
        <div class="gift-details">
            <div class="gift-name">${gift.name}</div>
            <div class="gift-id">${gift.gifId}</div>
        </div>
        <div class="gift-price" style="background-color: ${gift.background || '#2ea6ff'}">
            ${gift.price.toFixed(2)} <i class="fas fa-gem"></i>
        </div>
    `;
    
    // Add event listeners for buttons
    card.querySelector('.gift-info-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        viewGiftDetails(gift.id);
    });
    
    if (isMyGift) {
        card.querySelector('.gift-return-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            returnGiftToAccount(gift.id);
        });
    } else {
        card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(gift.id);
        });
    }
    
    // Whole card click for details
    card.addEventListener('click', () => {
        viewGiftDetails(gift.id);
    });
    
    return card;
}

// Create a collection card element
function createCollectionCard(collection) {
    const card = document.createElement('div');
    card.className = 'collection-card gift-card';
    card.setAttribute('data-id', collection.id);
    
    card.innerHTML = `
        <img src="${collection.image}" alt="${collection.name}" class="gift-image">
        <div class="gift-details">
            <div class="gift-name">${collection.name}</div>
            <div class="gift-id">${collection.giftCount} gifts</div>
        </div>
        <div class="collection-actions">
            <button class="collection-action-btn view-btn" data-id="${collection.id}">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="collection-action-btn sell-btn" data-id="${collection.id}">
                <i class="fas fa-tag"></i> Sell
            </button>
            <button class="collection-action-btn unpack-btn" data-id="${collection.id}">
                <i class="fas fa-box-open"></i> Unpack
            </button>
        </div>
    `;
    
    // Add event listeners for buttons
    card.querySelector('.view-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        viewCollectionDetails(collection.id);
    });
    
    card.querySelector('.sell-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        sellCollection(collection.id);
    });
    
    card.querySelector('.unpack-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        unpackCollection(collection.id);
    });
    
    // Whole card click for details
    card.addEventListener('click', () => {
        viewCollectionDetails(collection.id);
    });
    
    return card;
}

// View gift details
function viewGiftDetails(giftId) {
    console.log('Viewing gift details:', giftId);
    
    // Send data to bot
    sendDataToBot({
        action: 'view_gift',
        gift_id: giftId
    });
}

// View collection details
function viewCollectionDetails(collectionId) {
    console.log('Viewing collection details:', collectionId);
    
    // Send data to bot
    sendDataToBot({
        action: 'view_collection',
        collection_id: collectionId
    });
}

// Sell collection
function sellCollection(collectionId) {
    console.log('Selling collection:', collectionId);
    
    // Send data to bot
    sendDataToBot({
        action: 'sell_collection',
        collection_id: collectionId
    });
}

// Unpack collection
function unpackCollection(collectionId) {
    console.log('Unpacking collection:', collectionId);
    
    // Send data to bot
    sendDataToBot({
        action: 'unpack_collection',
        collection_id: collectionId
    });
}

// Return gift to account
function returnGiftToAccount(giftId) {
    console.log('Returning gift to account:', giftId);
    
    // Send data to bot
    sendDataToBot({
        action: 'return_gift',
        gift_id: giftId
    });
}

// Add to cart
function addToCart(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (gift && !cart.some(item => item.id === giftId)) {
        cart.push(gift);
        updateCartDisplay();
        
        // Haptic feedback if available
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    }
}

// Update cart display
function updateCartDisplay() {
    cartCount.textContent = cart.length;
}

// Send data to the Telegram bot
function sendDataToBot(data) {
    // Add user info if available
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        data.user_id = tg.initDataUnsafe.user.id;
        data.username = tg.initDataUnsafe.user.username;
    }
    
    // Send data to the bot
    tg.sendData(JSON.stringify(data));
}

// Add event listeners
function addEventListeners() {
    // Navigation tabs
    marketTab.addEventListener('click', (e) => {
        e.preventDefault();
        showMarketView();
    });
    
    myCollectionsTab.addEventListener('click', (e) => {
        e.preventDefault();
        showMyCollectionsView();
    });
    
    addCollectionTab.addEventListener('click', (e) => {
        e.preventDefault();
        showAddCollectionView();
    });
    
    myGiftsTab.addEventListener('click', (e) => {
        e.preventDefault();
        showMyGiftsView();
    });
    
    // Add/Subtract funds buttons
    addFundsBtn.addEventListener('click', () => {
        // Send deposit request to bot
        sendDataToBot({
            action: 'deposit_request'
        });
    });
    
    subtractFundsBtn.addEventListener('click', () => {
        // Just for demo purposes - not needed in production
        if (userBalance > 0.1) {
            updateBalance(userBalance - 0.1);
        }
    });
    
    // Filter categories
    document.querySelectorAll('.filter-category').forEach(category => {
        category.addEventListener('click', () => {
            document.querySelectorAll('.filter-category').forEach(cat => {
                cat.classList.remove('active');
            });
            category.classList.add('active');
            // In a real app, this would filter the gifts
        });
    });
    
    // Filter options
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', () => {
            // In a real app, this would open a filter dialog
            console.log('Filter option clicked:', option.querySelector('.filter-label').textContent);
        });
    });
    
    // Action buttons
    document.querySelectorAll('.filter-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // In a real app, this would trigger actions based on the button
            console.log('Action button clicked:', btn.innerHTML);
        });
    });
}

// Handle messages from the bot
function handleBotMessage(data) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received data from bot:', parsedData);
        
        // Handle different types of data
        if (parsedData.type === 'balance_update') {
            updateBalance(parsedData.balance);
        } else if (parsedData.type === 'show_view') {
            // Switch to a specific view
            switch(parsedData.view) {
                case 'market':
                    showMarketView();
                    break;
                case 'my_collections':
                    showMyCollectionsView();
                    break;
                case 'add_collection':
                    showAddCollectionView();
                    break;
                case 'my_gifts':
                    showMyGiftsView();
                    break;
            }
        } else if (parsedData.type === 'gift_data') {
            // Update gifts data and refresh view
            if (parsedData.gifts) {
                gifts.length = 0;
                parsedData.gifts.forEach(gift => gifts.push(gift));
                if (currentView === 'market') {
                    showMarketView();
                }
            }
        } else if (parsedData.type === 'collection_data') {
            // Update collections data and refresh view
            if (parsedData.collections) {
                collections.length = 0;
                parsedData.collections.forEach(collection => collections.push(collection));
                if (currentView === 'myCollections') {
                    showMyCollectionsView();
                }
            }
        } else if (parsedData.type === 'my_gifts_data') {
            // Update my gifts data and refresh view
            if (parsedData.gifts) {
                myGifts.length = 0;
                parsedData.gifts.forEach(gift => myGifts.push(gift));
                if (currentView === 'myGifts') {
                    showMyGiftsView();
                }
            }
        }
    } catch (error) {
        console.error('Error handling bot message:', error);
    }
}

// Set up event listeners for Telegram WebApp
tg.onEvent('viewportChanged', () => {
    // Adjust UI if needed when viewport changes
});

// Add CSS to handle collection action buttons
const style = document.createElement('style');
style.textContent = `
    .collection-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        background-color: var(--dark-card);
    }
    
    .collection-action-btn {
        flex: 1;
        margin: 0 4px;
        padding: 6px 0;
        border: none;
        border-radius: var(--button-radius);
        background-color: var(--dark-surface);
        color: var(--text-primary);
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }
    
    .collection-action-btn.view-btn {
        background-color: var(--accent-color);
    }
    
    .collection-action-btn.sell-btn {
        background-color: var(--dark-surface);
        color: #2ecc71;
    }
    
    .collection-action-btn.unpack-btn {
        background-color: var(--dark-surface);
        color: #f1c40f;
    }
    
    .add-collection-container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 70vh;
        gap: 20px;
    }
    
    .info-message {
        background-color: var(--dark-card);
        padding: 20px;
        border-radius: var(--card-radius);
        max-width: 400px;
    }
    
    .info-message h3 {
        margin-bottom: 10px;
        font-size: 18px;
    }
    
    .info-message p {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .action-button {
        background-color: var(--accent-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: var(--button-radius);
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Listen for messages from the bot
window.addEventListener('message', (event) => {
    if (event.source === window && event.data) {
        handleBotMessage(event.data);
    }
});
