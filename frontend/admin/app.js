document.addEventListener('DOMContentLoaded', () => {
    const productsTable = document.getElementById('products-table').getElementsByTagName('tbody')[0];
    const addProductForm = document.getElementById('add-product-form');
    const productNameInput = document.getElementById('product-name');

    const pricesTable = document.getElementById('prices-table').getElementsByTagName('tbody')[0];
    const addPriceForm = document.getElementById('add-price-form');
    const productIdInput = document.getElementById('product-id');
    const priceInput = document.getElementById('price');
    const dateInput = document.getElementById('date');
    const regionInput = document.getElementById('region');

    let selectedProductId = null;

    // Fetch and display products
    const getProducts = async () => {
        const response = await fetch('../backend/products.php');
        const products = await response.json();
        productsTable.innerHTML = '';
        products.forEach(product => {
            const row = productsTable.insertRow();
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>
                    <button class="view-prices" data-id="${product.id}">View Prices</button>
                    <button class="delete-product" data-id="${product.id}">Delete</button>
                </td>
            `;
        });
    };

    // Add a new product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productNameInput.value);
        await fetch('../backend/products.php', {
            method: 'POST',
            body: formData
        });
        productNameInput.value = '';
        getProducts();
    });

    // Handle product actions (view prices, delete)
    productsTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-product')) {
            const productId = e.target.dataset.id;
            await fetch(`../backend/products.php`, {
                method: 'DELETE',
                body: `id=${productId}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            getProducts();
        } else if (e.target.classList.contains('view-prices')) {
            const productId = e.target.dataset.id;
            selectedProductId = productId;
            productIdInput.value = productId;
            getPrices(productId);
        }
    });

    // Fetch and display prices for a product
    const getPrices = async (productId) => {
        const response = await fetch(`../backend/prices.php?product_id=${productId}`);
        const prices = await response.json();
        pricesTable.innerHTML = '';
        prices.forEach(price => {
            const row = pricesTable.insertRow();
            row.innerHTML = `
                <td>${price.id}</td>
                <td>${price.price}</td>
                <td>${price.date}</td>
                <td>${price.region}</td>
                <td><button class="delete-price" data-id="${price.id}">Delete</button></td>
            `;
        });
    };

    // Add a new price
    addPriceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_id', productIdInput.value);
        formData.append('price', priceInput.value);
        formData.append('date', dateInput.value);
        formData.append('region', regionInput.value);

        await fetch('../backend/prices.php', {
            method: 'POST',
            body: formData
        });

        priceInput.value = '';
        dateInput.value = '';
        regionInput.value = '';
        if (selectedProductId) {
            getPrices(selectedProductId);
        }
    });

    // Handle price deletion
    pricesTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-price')) {
            const priceId = e.target.dataset.id;
            await fetch(`../backend/prices.php`, {
                method: 'DELETE',
                body: `id=${priceId}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            if (selectedProductId) {
                getPrices(selectedProductId);
            }
        }
    });

    // Initial load
    getProducts();
});
