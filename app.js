const productsPerPage = 10;
let currentPage = 1;
let totalProducts = 0;

totalAPIurl = 'https://dummyjson.com/products?limit=100';

const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        const products = response.data.products;
        totalProducts = products.length;
        displayProducts(products);
        renderPagination();
        console.log('Products data:', products);
    } catch (error) {
        handleError(error);
    }
};

const fetchDataById = async (productId) => {
    const url = `https://dummyjson.com/products/${productId}`;
    try {
        const response = await axios.get(url);
        const product = response.data; // Assuming the detailed product information is in the response
        displayProductDetails(product);
        console.log('Product details:', product);
    } catch (error) {
        handleError(error);
    }
};

const displayProducts = (products) => {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
        const product = products[i];
        if (product) {
            const productElement = document.createElement('div');
            productElement.classList.add('productElement');
            productElement.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: ${product.price}</p>
                <button class="details-button" data-product-id="${product.id}">View Details</button>
                <hr>
            `;
            container.appendChild(productElement);
        }
    }

    // Add event listeners to the details buttons
    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            fetchDataById(productId);
        });
    });
};

const displayProductDetails = (product) => {
    const productContainer = document.getElementById('productContainer');
    const detailsContainer = document.getElementById('productDetails');
    const paginationContainer = document.getElementById('pagination');

    // Hide product list and pagination, and show details
    productContainer.style.display = 'none';
    paginationContainer.style.display = 'none';
    detailsContainer.style.display = 'block';

    detailsContainer.innerHTML = `
        <h2>${product.title}</h2>
        <p>Price: ${product.price}</p>
        <p>Description: ${product.description}</p>
        <button onclick="clearProductDetails()">Close Details</button>
    `;
};

const clearProductDetails = () => {
    const productContainer = document.getElementById('productContainer');
    const detailsContainer = document.getElementById('productDetails');
    const paginationContainer = document.getElementById('pagination');

    // Show product list and pagination, hide details
    productContainer.style.display = 'block';
    paginationContainer.style.display = 'block';
    detailsContainer.style.display = 'none';

    detailsContainer.innerHTML = ''; // Clear the details container
};

const renderPagination = () => {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('button');
        pageItem.textContent = i;
        pageItem.classList.add('page-item');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(pageItem);
    }
};

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalProducts / productsPerPage)) {
        currentPage = newPage;
        fetchData(totalAPIurl);
    }
};

const prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        fetchData(totalAPIurl);
    }
};

const nextPage = () => {
    currentPage++;
    fetchData(totalAPIurl);
};

const handleError = (error) => {
    if (error.response) {
        console.error('Server responded with a non-success status:', error.response.status);
        console.error('Response data:', error.response.data);
    } else if (error.request) {
        console.error('No response received from the server');
    } else {
        console.error('Error setting up the request:', error.message);
    }
};

// Initial data fetch
fetchData(totalAPIurl);
