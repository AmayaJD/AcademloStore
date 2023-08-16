
async function getApi(){
    try {
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/');
        const res = await data.json();
        window.localStorage.setItem('products', JSON.stringify(res));
        return res;
    } catch (error) {
        console.log(error);
    }
}

function events() {
    const modal = document.querySelector('.modal');
    const modal2 = document.querySelector('.modal2');
    const cart_button = document.querySelector('.cart_button');
    const menu_cart = document.querySelector('.menu_cart');
    cart_button.addEventListener('click', function () {
    menu_cart.classList.toggle('active');
    });

    modal.addEventListener('click', function(){
        modal.classList.remove('active');
    });

    modal2.addEventListener('click', function(){
        modal2.classList.remove('active');
    });

}

function printProducts(db){
    const productsHTML = document.querySelector('.products');
    let html = '';
    for (const product of db.products) {
        html += `
            <div class="product">
                <div class="product_img">
                    <img id=${product.id} class='modal_img'  src="${product.image}" alt="image_product">
                </div>

                <div class="product_info">
                    <h3>${product.name}</h3>
                    <h4>Precio: $${product.price}</h4>
                    <p>Stock: ${product.quantity}</p>
                    <button id= ${product.id} class='cart_buy'>Add Cart</button>
                </div>
            </div>
        `
        
    }
    productsHTML.innerHTML = html;

}

function addToCart(db){
    const productsHTML = document.querySelector('.products');
    productsHTML.addEventListener('click', function (event) {
        if(event.target.classList.contains('cart_buy')){
            const id = Number(event.target.id);
            const productFind = db.products.find(function (product) {
                return product.id === id;
            })
            //console.log(productFind);
            if(db.cart[productFind.id]){
                db.cart[productFind.id].amount++;
            }else {
                productFind.amount = 1;
                db.cart[productFind.id] = productFind;
            }
            //console.log(db.cart);
            window.localStorage.setItem('cart', JSON.stringify(db.cart));
            printToCart(db);
            totalCart(db)
        }
        
    })
}

function printToCart(db){
    const cart_products = document.querySelector('.cart_products');
    let html = '';
    for(const product in db.cart){
        const {quantity, price, name, image, id, amount} = db.cart[product];
        html += `
            <div class="cart_product">
                
                <div class="cart_product_image">
                    <img id=${product.id} class='modal_img' src='${image}' alt='image product'/>
                </div>
                <div class="cart_product_container">
                    <div class="cart_product_description">
                        <h3>${name}</h3>
                        <h4>Precio: $${price}</h4>
                        <p>Stock: ${quantity}</p>
                    </div>
                    <div id=${id} class="cart_counter">
                        <b class='less'>-</b>
                        <span>${amount}</span>
                        <b class='plus'>+</b>
                        <img class= 'trash' src='./img/trash.png' alt='trash'/>
                    </div>
                </div>
            </div>
        `;
    }
    cart_products.innerHTML = html;
}

function handleCart(db){
    const cart_products = document.querySelector('.cart_products');
    cart_products.addEventListener('click', function (event) {
        if(event.target.classList.contains('plus')){
            const id = Number(event.target.parentElement.id);
            const productFind = db.products.find(function(product) {
                return product.id ===id;
            });
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount){
                    return alert('No tenemos mas en bodega');
                }
            }
            db.cart[id].amount++;
        }
        if(event.target.classList.contains('less')){
            const id = Number(event.target.parentElement.id);
            if(db.cart[id].amount===1){
                const response = confirm('Lo quieres borrar?');
                if(response){
                    delete db.cart[id];
            }
            } else{
                db.cart[id].amount--;
            }
        }
        if(event.target.classList.contains('trash')){
            const id = Number(event.target.parentElement.id);
            const response = confirm('Si quieres borrar?');
            if(!response){
                return;
            }
            delete db.cart[id];
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printToCart(db);
        totalCart(db)
        
    })
}

function totalCart(db){
    const info_total = document.querySelector('.info_total');
    const info_amount = document.querySelector('.info_amount');

    let totalProducts = 0;
    let amountProducts = 0;

    for(const product in db.cart){
        amountProducts += db.cart[product].amount;
        totalProducts += db.cart[product].amount * db.cart[product].price;
    }

    info_total.textContent = 'Total: $'+totalProducts;
    info_amount.textContent = 'Amount: ' +amountProducts;
}

function buyCart(db){
    const menu_cart = document.querySelector('.menu_cart');
    const btnBuy = document.querySelector('.btn_buy');
    const modal2 = document.querySelector('.modal2');
    const modal_alert = document.querySelector('.modal_alert');
    btnBuy.addEventListener('click', function(){
        if(!Object.keys(db.cart).length){
            return alert('No tienes productos para comprar');
        }
        const response = confirm('Seguro que quieres comprar?');
        if(!response){
            return;
        }
        modal_alert.innerHTML =`
            <h1>Gracias por tú compra!</h1>
            <span>x</span>
        `;

        for (const product of db.products) {
            const cartProduct = db.cart[product.id];
            if(product.id===cartProduct?.id){
                product.quantity -= cartProduct.amount;
            }

        }
        modal2.classList.add('active');
        menu_cart.classList.remove('active');

        db.cart = {}
        window.localStorage.setItem('products', JSON.stringify(db.products));
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printProducts(db);
        printToCart(db);
        totalCart(db);

    })
}

function handleList(db){
    const select = document.getElementById('categ');
    select.addEventListener('change', function(){
        var selectedOption = this.options[select.selectedIndex];
        //console.log(selectedOption.text);

        if(selectedOption.text === "All"){
        printProducts(db);
        };

        if(selectedOption.text === "Shirts"){
            const productsHTML = document.querySelector('.products');
            let html = '';
            for (const product of db.products) {
                if(product.category==='shirt'){
                    html += `
                        <div class="product">
                            <div class="product_img">
                                <img id=${product.id} class='modal_img'  src="${product.image}" alt="image product">
                            </div>

                            <div class="product_info">
                                <h3>${product.name}</h3>
                                <h4>Precio:$${product.price}</h4>
                                <p>Stock: ${product.quantity}</p>
                                <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                            </div>
                        </div>
                    `;
                    
                }
            }
            productsHTML.innerHTML = html;
        };

        if(selectedOption.text === "Hoddies"){
            console.log("entre")
            const productsHTML = document.querySelector('.products');
            let html = '';
            for (const product of db.products) {
                if(product.category==='hoddie'){
                    html += `
                        <div class="product">
                            <div class="product_img">
                                <img id=${product.id} class='modal_img'  src="${product.image}" alt="image product">
                            </div>

                            <div class="product_info">
                                <h3>${product.name}</h3>
                                <h4>Precio:$${product.price}</h4>
                                <p>Stock: ${product.quantity}</p>
                                <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                            </div>
                        </div>
                    `;
                    
                }
            }
            productsHTML.innerHTML = html;
        };

        if(selectedOption.text === "Sweaters"){
            console.log("entre")
            const productsHTML = document.querySelector('.products');
            let html = '';
            for (const product of db.products) {
                if(product.category==='sweater'){
                    html += `
                        <div class="product">
                            <div class="product_img">
                                <img id=${product.id} class='modal_img'  src="${product.image}" alt="image product">
                            </div>

                            <div class="product_info">
                                <h3>${product.name}</h3>
                                <h4>Precio:$${product.price}</h4>
                                <p>Stock: ${product.quantity}</p>
                                <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                            </div>
                        </div>
                    `;
                    
                }
            }
            productsHTML.innerHTML = html;
        };
    });
    
}

function modalProduct(db){
    const productsHTML = document.querySelector('.products');
    const modal = document.querySelector('.modal');
    const modal_product = document.querySelector('.modal_product');
    productsHTML.addEventListener('click', function (event) {
        if(event.target.classList.contains('modal_img')){
            const id = Number(event.target.id);
            const productFind = db.products.find(function(product) {
                return product.id === id;
            });
            modal_product.innerHTML = `
                <div class="modal_img_product">
                    <img src='${productFind.image}' alt='image product'/>
                </div>
                <div class="modal_group">
                    <h3><span>Nombre: </span>${productFind.name}</h3>
                    <br>
                    <h3><span>Description: </span>${productFind.description}</h3>
                    <br>
                    <h3><span>Categoria: </span>${productFind.category}</h3>
                    <h3><span>Precio: $</span>${productFind.price} | <span>Stock: </span>${productFind.quantity}</h3>
                </div>
                <span>x</span>
            `;
            modal.classList.add('active');
        }
    });
}

async function main(){
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || await getApi(),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }
    // console.log(db.products);
    //Se ejecutan los eventos
    events();
    //Imprimo los productos en la pagina
    printProducts(db);
    //Se adicionan los productos al carrito
    addToCart(db);
    //Se imprimen los productos del carrito
    printToCart(db);
    //Eventos de usuario en el carrito
    handleCart(db);
    //Maneja los totales del carrito
    totalCart(db);
    // Maneja el evento de la compra
    buyCart(db);
    //Maneja los eventos del navBar
    handleList(db);
    //Manejamos el evento del modal
    modalProduct(db);
    
}
main();