const menu = document.getElementById("menu")
const cartBnt = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModelBtn = document.getElementById("close-modal-bnt")
const cartCouter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];


cartBnt.addEventListener("click", function(){
    cartModal.style.display ="flex"
    updateCartModel();
})


cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
    cartModal.style.display ="none"
    }
})

closeModelBtn.addEventListener("click", function(){
    cartModal.style.display ="none"
})


menu.addEventListener("click", function(event){
     
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
    
        addToCart(name, price)
    }
})



function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
        
    }else{

        cart.push({
            name,
            price,
            quantity: 1,
           })

    }
     
   updateCartModel()

}


 function updateCartModel(){
   cartItemsContainer.innerHTML = "";
   let total = 0;

    cart.forEach(item => {
       const cartItemElement = document.createElement("div")
       cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

       cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>


          <button class="remove-from-cart-bnt" data-name="${item.name}">
            Remover
          </button>

      </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCouter.innerHTML = cart.length;
}


cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-bnt")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModel();
            return;
        }
    
        cart.splice(index, 1);
        updateCartModel();
    
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.Value;

    if(inputValue !== ""){
       addressInput.classList.remove("border-red-500")
       addressWarn.classList.add("hidden")     
    }

    
})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "A pizzaria esta fechada, volte mais tarde!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444"
            },            
        }).showToast();
        
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
       addressWarn.classList.remove("hidden")
       addressInput.classList.add("border-red-500")
       return;
    }


    const cartItems = cart.map((item)=> {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11968143359"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,"_blank")

    cart = [];
    updateCartModel();

})


function checkRestaurantOpen(){
   const data = new Date();
   const hora = data.getHours();
   return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
