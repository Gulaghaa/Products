const productsPerPage = 10;
let currentPage = 1;
let totalProducts = 0;

const fetchData = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/products?limit=100");
        const products = response.data.products;
        totalProducts = products.length;
        displayProducts(products);
        renderPagination();
        console.log('Products data:', products);
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
            productElement.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: ${product.price}</p>
                <hr>
            `;
            container.appendChild(productElement);
        }
    }
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
        fetchData();
    }
};

const prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        fetchData();
    }
};

const nextPage = () => {
    currentPage++;
    fetchData();
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
fetchData();
