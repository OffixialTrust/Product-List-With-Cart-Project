import { data } from "./data.js";

function qS(query) {
  return document.querySelector(query);
}

function qSA(query) {
  return document.querySelectorAll(query);
}


// Variables holding array/list of item details
const categories = qSA(".category");
const names = qSA(".name");
const prices = qSA(".price");
const images = qSA(".main-img");
const cartButtons = qSA(".cart-button");
const itemQuantities = Array.from(qSA(".item-quantity"));
const confirmOrder = qS("#confirm-order");

// Styling Variables
const buttonContainers = qSA(".button-container");
const itemQuantityHolders = qSA(".item-quantity-holder");

// Cart Variables 
const viewCart = qS(".view-cart");
const emptyCart = qS(".empty-cart");
const orderConfirmed = qS(".order-confirmed");

let device = "mobile";

// Inputting the data into the details of "item"
for (let i = 0; i < data.length; i++) {
  names[i].textContent = data[i].name;
  categories[i].textContent = data[i].category;
  prices[i].textContent = "$" + data[i].price.toFixed(2);
  
  /*
  if (window.matchMedia("(max-width: 767px)").matches) {
    device = "mobile";
} else if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
    device = "tablet";
} else {
    device = "desktop";
}
  */

images[i].src = data[i].image[device];
  addProductStyles(i);
  recognizeOrder(i);
}

function recognizeOrder(i) {
  cartButtons[i].addEventListener("click", () => {
    let num = 1;
    itemQuantities[i].innerHTML = num;
    // alterQuantity(i);
    appendConfirmationOrder(i, num);
  });
}

// Changing the styles when "add-to-cart" button is clicked
function addProductStyles(i) {
    cartButtons[i].addEventListener("click", () => {
      buttonContainers[i].style.border = "1px solid hsl(14, 86%, 42%)"
      images[i].style.border = "2px solid hsl(14, 86%, 42%)";
      itemQuantityHolders[i].style.top = 0;
      viewCart.style.display = "block";
      emptyCart.style.display = "none";
  });
}

function removeProductStyles(i) {
  buttonContainers[i].style.border = "1px solid hsl(7, 20%, 60%)";
  images[i].style.border = "none";
itemQuantityHolders[i].style.top = "100%";
}

function updateOrderDetails(num, price, orderDetail) {
  orderDetail.querySelector(".item-quantity").innerHTML = num; 
  orderDetail.querySelector(".total-item-price").innerHTML = (num * price).toFixed(2); 
  updateTotalQuantity();
  updateTotalPrice();
}

function alterQuantity(i, orderIndex, confirmedItemIndex) {  
  const price = data[i].price.toFixed(2); // Get the item price
  
// Select the corresponding order detail 
  const orderDetail = document.querySelectorAll(".individual-order-details")[orderIndex];
  const confirmedOrderDetail = document.querySelectorAll(".confirmed-item")[confirmedItemIndex];
  
  // Initial quantity
  let num = Number(orderDetail.querySelector(".item-quantity").innerHTML);
  
  updateTotalQuantity();
  updateTotalPrice();
  
  // Handle increment button 
  qSA(".increment-quantity")[i].addEventListener("click", () => { 
  num++; 
  itemQuantities[i].innerHTML = num; // Update displayed quantity
  updateOrderDetails(num, price, orderDetail);
  updateOrderDetails(num, price, confirmedOrderDetail);
  });

  // Handle decrement button 
  qSA(".decrement-quantity")[i].addEventListener("click", () => { 
    num--; 
  if (num >= 1) { // Prevent going below 1
    itemQuantities[i].innerHTML = num; updateOrderDetails(num, price, orderDetail);
    updateOrderDetails(num, price, confirmedOrderDetail);
    } else if (num == 0) {
  orderDetail.remove();
  confirmedOrderDetail.remove();
  updateTotalQuantity();
  updateTotalPrice();
  removeProductStyles(i);
  }
  }); 
  
orderDetail.querySelector(".remove-item").addEventListener("click", () => {
  orderDetail.remove();
  confirmedOrderDetail.remove();
  updateTotalQuantity();
  updateTotalPrice();
  removeProductStyles(i);
  });
}

function appendConfirmationOrder(i, num) {
  // Create the order details container
  const individualOrderDetails = document.createElement("div");
  individualOrderDetails.classList = "individual-order-details"; // Assign class
  const confirmedItem = document.createElement("div");
  confirmedItem.classList = "confirmed-item"; // Assign class
  
  // Get the number of existing orders to determine the new index
  const orderIndex = qSA(".individual-order-details").length;
  const confirmedItemIndex = qSA(".confirmed-item").length;
  
  // Retrieve item details
  const name = data[i].name;
  const price = data[i].price.toFixed(2);
  const totalItemPrice = (price * num).toFixed(2);
  
  // Build the order details HTML
  individualOrderDetails.innerHTML = `
    <div>
        <p class="item-name dark-text bold">${name}</p>
        <p class="item-numbers-price">
            <span class="orange-text bold"><span class="item-quantity">${num}</span>x</span>
            <span class="small-text single-item"> @ $<span class="single-item-price">${price}</span></span> 
            <span class="small-text bold">$<span class="total-item-price">${totalItemPrice}</span></span>
        </p>
    </div>
    <div>
        <img class="remove-item" src="./assets/images/icon-remove-item.svg" alt="remove-item">
    </div>`;
    
    confirmedItem.innerHTML = `<img class="confirmed-item-image" src=${data[i].image.thumbnail} alt="confirmed item">
                     <div class="details-holder">
        <p class="item-name dark-text bold">${name}</p>
        
        <p class="item-numbers-price">
            <span class="orange-text bold"><span class="item-quantity">${num}</span>x</span>
             <span class="small-text single-item"> @ $<span class="single-item-price">${price}</span></span>            
             </p>
      </div>
      <p class="small-text bold">$<span class="total-item-price">${totalItemPrice}</span></p>`;
  // Append the new order details to the order listconfirmedItem.style.width = "100%";

  qS(".order-details").appendChild(individualOrderDetails);
  qS(".confirmed-order-details").appendChild(confirmedItem);

  
  // Call function to handle quantity adjustments
  alterQuantity(i, orderIndex, confirmedItemIndex);
}

function updateTotalQuantity() {
  const totalOrderDetails = Array.from(document.querySelectorAll(".individual-order-details .item-quantity")
    );
  let totalItemQuantity = totalOrderDetails.map( i => {
  return Number(i.innerHTML);
  }).reduce((a, b) => a + b, 0);
  
  qS("#total-quantity").innerHTML = totalItemQuantity;
  
  if (Number(qS("#total-quantity").innerHTML) === 0) {
      viewCart.style.display = "none";
      emptyCart.style.display = "block";
  }
}

function updateTotalPrice() {
  const totalOrderDetails = Array.from(document.querySelectorAll(".individual-order-details .total-item-price")
    );
  let totalItemPrice = totalOrderDetails.map( i => {
  return Number(i.innerHTML);
  }).reduce((a, b) => a + b, 0);
  
  qSA(".total-price").forEach(i => {
  i.innerHTML = totalItemPrice.toFixed(2);
});
}

confirmOrder.addEventListener("click", () => {
  orderConfirmed.style.display = "block";
  qS("#overlay").style.display = "block";
  if (window.matchMedia("(max-width: 767px)").matches) {
    qS("#overlay").style.display = "block";
  }
});

qS("#start-new-order").addEventListener("click", () => {
  itemQuantities.forEach(i =>  i.innerHTML = 0);
  qSA(".order-details .item-quantity").forEach(i => i.innerHTML = 0);
  
  qSA(".confirmed-order-details .item-quantity").forEach(i => i.innerHTML = 0);
  buttonContainers.forEach(i => i.style.border = "1px solid hsl(7, 20%, 60%)")
  images.forEach(i => i.style.border = "none")
itemQuantityHolders.forEach(i => i.style.top = "100%");
 orderConfirmed.style.display = "none";
 updateTotalPrice();
 updateTotalQuantity();
 const parent1 = qS(".order-details");
 const parent2 = qS(".confirmed-order-details");
 while(parent1.hasChildNodes()) {
   parent1.removeChild(parent1.firstChild);
 }
 
 while(parent2.hasChildNodes()) {
   parent2.removeChild(parent2.firstChild);
 }
 qS("#overlay").style.display = "none";
});
  
  




