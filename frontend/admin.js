
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    fetchItems();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    document.getElementById('item-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const itemPrice = document.getElementById('item-price').value;

        try {
            const response = await fetch('/api/prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: itemName, price: itemPrice })
            });
            if (response.ok) {
                fetchItems();
                document.getElementById('item-form').reset();
            } else {
                console.error('Failed to save item');
            }
        } catch (error) {
            console.error('Error saving item:', error);
        }
    });
});

async function fetchItems() {
    try {
        const response = await fetch('/api/prices');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function displayItems(items) {
    const listContainer = document.getElementById('items-list');
    listContainer.innerHTML = '<h3>Existing Items</h3>';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <span>${item.name} - ${item.price}</span>
            <div>
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;
        listContainer.appendChild(itemElement);
    });
}

