document.addEventListener('DOMContentLoaded', function() {
    function changeQuantity(id, value) {
        const quantityElement = document.getElementById(id);
        if (quantityElement) {
            let quantity = parseInt(quantityElement.textContent);
            quantity += value;
            if (quantity < 0) {
                quantity = 0; // Ensure quantity doesn't go below 0
            }
            quantityElement.textContent = quantity;
        }
    }
    
    function selectProduct(productName) {
        console.log(`selectProduct function called with argument: ${productName}`); // Add this line
        const quantityElement = document.getElementById(`quantity_${productName}`);
        if (quantityElement) {
            const quantity = parseInt(quantityElement.textContent);
            if (quantity > 0) {
                // Perform the desired action when the product is selected
                console.log(`Product ${productName} selected with quantity: ${quantity}`);
    
                // Toggle the selected state of the product
                const product = document.querySelector(`.product[data-name="${productName}"]`);
                product.classList.toggle('selected');
            } else {
                // Show an error message if quantity is 0
                alert('Please select a quantity before selecting the product.');
            }
        } else {
            console.error(`Quantity element for product ${productName} not found.`);
        }
    }
    
    function sendOrder() {
        // Get the selected products and quantities
        const selectedProducts = [];
        const products = document.querySelectorAll('.product');
        products.forEach((product) => {
            const productName = product.getAttribute('data-name');
            const quantityElement = document.getElementById(`quantity_${productName}`);
            if (quantityElement) {
                const quantity = parseInt(quantityElement.textContent);
                if (quantity > 0) {
                    selectedProducts.push(`${productName}: ${quantity}`);
                }
            } else {
                console.error(`Quantity element for product ${productName} not found.`);
            }
        });
    
        if (selectedProducts.length > 0) {
            // Construct the WhatsApp message
            const message = encodeURIComponent(`Order Details:\n${selectedProducts.join('\n')}`);
    
            // Construct the WhatsApp URL
            const whatsappURL = `https://api.whatsapp.com/send?phone=1234567890&text=${message}`; // Replace 1234567890 with the recipient's phone number
    
            // Open the WhatsApp URL in a new tab
            window.open(whatsappURL, '_blank');
        } else {
            alert('Please select at least one product before sending the order.');
        }
    }
});