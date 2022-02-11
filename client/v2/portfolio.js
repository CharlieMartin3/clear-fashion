// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


let FilterDateRange = (marketplace,max) =>{
  return marketplace.filter(function(element) { return new Date(element.released) < max} )
}

var twoweeks = new Date()
twoweeks.setDate(twoweeks.getDate()-15);


const newProducts = async() => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    const newProduct = FilterDateRange(body.data, twoweeks)

    return newProduct;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};




/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  const newProduct = newProducts()

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = newProduct.length();
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});


selectBrand.addEventListener('change', event => {
  if(event.target.value == "all"){
    fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
  }
  else{
    renderProducts(GetProductsByBrand(event.target.value))
  }
});

selectSort.addEventListener('change', event => {
  if(event.target.value == "date-asc"){
    renderProducts(GetProductsByDate(1))
  }
  else if(event.target.value == "date-desc"){
    renderProducts(GetProductsByDate(-1))
  }
  else if(event.target.value == "price-asc")
  {
    renderProducts(GetProductsByPrice(1))
  }
  else if(event.target.value == "price-desc"){
    renderProducts(GetProductsByPrice(-1))
  }
  else
  {
    fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
  }
});


document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);



function GetProductsByBrand(brandName) {
  let brandProducts = [];
  for (let i = 0; i < currentProducts.length; i++) {
      if (currentProducts[i].brand == brandName) {
          brandProducts.push(currentProducts[i]);
      }
  }
  return brandProducts;
}

function GetProductsByDate(order) {
  let brandProducts = [];
  if(order == 1){ //ascendant
    return currentProducts.sort((a,b)=>(new Date(a.released)-new Date(b.released)));
  }
  else
  {
    return currentProducts.sort((a,b)=>(new Date(b.released)-new Date(a.released)));
  }
}

function GetProductsByPrice(order) {
  let brandProducts = [];
  if(order == 1){ //ascendant
    return currentProducts.sort((a,b)=>(a.price-b.price));
  }
  else
  {
    return currentProducts.sort((a,b)=>(b.price-a.price));
  }
}








