let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">₦${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

let totalOrderPrice = 0;

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    totalOrderPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            // Calculate the total price for each item and add it to the total order amount
            let itemTotalPrice = info.price * item.quantity;
            totalOrderPrice += itemTotalPrice;

            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">₦${itemTotalPrice}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>
            <button class="removeItem">Remove</button>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;

    // Update the total order amount wherever needed
    // For example, you can display it in an element with class 'totalOrderAmount'
    document.querySelector('.totalOrderAmount').innerText = `Total Order Amount: ₦${totalOrderPrice.toFixed(2)}`;
}

// ... (existing code)

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('removeItem')) {
        let product_id = positionClick.parentElement.dataset.id;
        changeQuantityCart(product_id, 'remove'); // Call the changeQuantityCart function with the 'remove' type
    } else if (positionClick.classList.contains('minus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        changeQuantityCart(product_id, 'minus'); // Call the changeQuantityCart function with the 'minus' type
    } else if (positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        changeQuantityCart(product_id, 'plus'); // Call the changeQuantityCart function with the 'plus' type
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'remove') {
            // Remove the item from the cart
            cart.splice(positionItemInCart, 1);
        } else if (type === 'minus') {
            // Decrease the quantity by 1
            if (cart[positionItemInCart].quantity > 1) {
                cart[positionItemInCart].quantity--;
            }
        } else if (type === 'plus') {
            // Increase the quantity by 1
            cart[positionItemInCart].quantity++;
        }
        addCartToHTML(); // Update the cart display in the HTML
        addCartToMemory(); // Save the updated cart to local storage
    }
};

// ... (existing code)


const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();

// ... (existing code)

// Function to construct the WhatsApp URL with the order details
const constructWhatsAppURL = () => {
    const recipientPhoneNumber = '+2348024756428'; // Replace with the actual recipient's phone number
    let orderMessage = 'Your order details:\n';
    cart.forEach(item => {
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
        let info = products[positionProduct];
        orderMessage += `${info.name} - Quantity: ${item.quantity}\n`;
    });
    orderMessage += `Total Quantity: ${iconCartSpan.innerText}`;

    return `https://wa.me/${+2348024756428}?text=${encodeURIComponent(orderMessage)}`;
}


// Event listener for the checkout button
const checkoutButton = document.querySelector('.checkOut');
checkoutButton.addEventListener('click', () => {
    const whatsappURL = constructWhatsAppURL();
    window.open(whatsappURL, '_blank'); // Open the WhatsApp URL in a new tab
});
