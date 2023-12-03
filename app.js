const productsPerPage = 10;
let currentPage = 1;
let totalProducts = 0;
let storedPage = 1;
let searchQuery = '';
const totalAPIurl = 'https://dummyjson.com/products?limit=100';

const fetchData = async (url, page = currentPage) => {
    try {
        const response = await axios.get(url);
        const products = response.data.products;

        const filteredProducts = products.filter(product => {
            return Object.values(product).some(value => {
                if (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return true;
                }
                if (typeof value === 'number' && value.toString().includes(searchQuery)) {
                    return true;
                }
                return false;
            });
        });


        totalProducts = filteredProducts.length;
        currentPage = page;
        storedPage = currentPage;
        displayProducts(filteredProducts);
        renderPagination();
        console.log('Products data:', filteredProducts);
    } catch (error) {
        handleError(error);
    }
};

const handleSearchInput = (event) => {
    searchQuery = event.target.value;
    currentPage = 1;
    fetchData(totalAPIurl);
};

function roundToDecimal(number, decimalPlaces) {
    let roundedNumber = parseFloat(number.toFixed(decimalPlaces));
    return roundedNumber.toLocaleString('en-US', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
}

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
                 <div class='thumbnail'>
                    <div class='absolute'></div>
                    <img src="${product.thumbnail}"/>
                </div>
                <span class='category'>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                <div class='info'>
                    <span>${product.title}</span>
                </div>
                <div class= 'price'>
                    <div>
                        <span style="text-decoration: line-through" ><span>&#36;</span>${product.price}.00</span>
                        <span><span>&#36;</span>${roundToDecimal(product.price - product.price * product.discountPercentage / 100, 2)}</span>
                    </div>
                    <div>Save:<span><span>&#36;</span>${roundToDecimal(product.price * product.discountPercentage / 100, 2)}</span><span>(${roundToDecimal(product.discountPercentage,1)}%)</span></div>
                </div>
                <button class="details-button" data-product-id="${product.id}">Get More Information</button>
                <span class="stock">${product.stock} left in stock</span>
            `;
            container.appendChild(productElement);
        }
    }



    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            fetchDataById(productId);
        });
    });
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
            pageItem.style.backgroundColor = '#007BFF';
            pageItem.style.color = '#fff';
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

const fetchDataById = async (productId) => {
    const url = `https://dummyjson.com/products/${productId}`;
    try {
        const response = await axios.get(url);
        const product = response.data;
        displayProductDetails(product);
        console.log('Product details:', product);
    } catch (error) {
        handleError(error);
    }
};

const displayProductDetails = (product) => {
    const productContainer = document.getElementById('productContainer');
    const detailsContainer = document.getElementById('productDetails');
    const paginationContainer = document.getElementById('pagination');
    const searchContainer = document.getElementById('searchContainer');

    productContainer.style.display = 'none';
    paginationContainer.style.display = 'none';
    searchContainer.style.display = 'none';
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
    const searchContainer = document.getElementById('searchContainer');

    productContainer.style.display = 'flex';
    paginationContainer.style.display = 'block';
    searchContainer.style.display = 'flex'
    detailsContainer.style.display = 'none';
    detailsContainer.innerHTML = '';
    fetchData(totalAPIurl, storedPage);


};

fetchData(totalAPIurl);
