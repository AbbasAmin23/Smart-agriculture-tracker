document.addEventListener('DOMContentLoaded', () => {
    const marketRateForm = document.getElementById('market-rate-form');
    const productManagementForm = document.getElementById('product-management-form');
    const productList = document.getElementById('product-list');

    // Fetch and display products
    function fetchProducts() {
        fetch('../backend/products.php')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '<h3>Existing Products</h3>';
                products.forEach(product => {
                    const productEl = document.createElement('div');
                    productEl.innerHTML = `<span>${product.name}</span> <button data-id="${product.id}" class="delete-btn">Delete</button>`;
                    productList.appendChild(productEl);
                });
            });
    }

    // Handle market rate form submission
    marketRateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(marketRateForm);
        fetch('../backend/prices.php', { method: 'POST', body: formData })
            .then(() => {
                marketRateForm.reset();
                alert('Market rate updated!');
            });
    });

    // Handle new product form submission
    productManagementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProductName = document.getElementById('new-product-name').value;
        if (newProductName) {
            const formData = new FormData();
            formData.append('name', newProductName);
            fetch('../backend/products.php', { method: 'POST', body: formData })
                .then(() => {
                    productManagementForm.reset();
                    fetchProducts();
                });
        }
    });

    // Handle product deletion
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const productId = e.target.dataset.id;
            fetch(`../backend/products.php?id=${productId}`, { method: 'DELETE' })
                .then(() => fetchProducts());
        }
    });

    fetchProducts();
});