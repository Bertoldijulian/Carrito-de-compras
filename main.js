
const db = {
    methods: {
        /* A function that returns the item from the database. */
        find: (id) => {
            return db.items.find((item) => item.id === id)
        },
        /* A function that removes the items from the database. */
        remove: (items) => {
            return items.forEach((item) => {
                const product = db.methods.find(item.id);
                product.stock = product.stock - item.stock;
            });
        },
    },

    items:[
        {
            id: 0,
            title: 'Samsung S22 Ultra',
            price: 223000,
            stock: 3,
            img: 'S22Ultra.jpg',
        },
        {
            id: 1,
            title: 'Samsung S22',
            price: 205000,
            stock: 5,
            img: 'Samsung-S22.jpg',
        },
        {
            id: 2,
            title: 'Iphone 14 Pro',
            price: 250000,
            stock: 3,
            img: 'Iphone-14-Pro.jpg',
        },
        {
            id: 3,
            title: 'Iphone 14',
            price: 227000,
            stock: 5,
            img: 'Iphone-14.jpg',
        },
        {
            id: 4,
            title: 'Google Pixel 7 Pro ',
            price: 215000,
            stock: 1,
            img: 'Google-Pixel-7-Pro.jpg',
        },
        {
            id: 5,
            title: 'Xiaomi 12 Pro',
            price: 200000,
            stock: 2,
            img: 'Xiaomi-12-Pro.jpg',
        },
        {
            id: 6,
            title: 'OPPO Find X5 Pro',
            price: 230000,
            stock: 2,
            img: 'Oppo-Find-x5-Pro.jpg',
        },
        {
            id: 7,
            title: 'OnePlus 10 Pro',
            price: 218000,
            stock: 3,
            img: 'Oneplus-10-Pro.jpg',
        },
        {
            id: 8,
            title: 'Realme GT 2 Pro',
            price: 203000,
            stock: 1,
            img: 'Realme-GT-2-Pro.jpg',
        },
    ]
    
}

const shoppingCart = {
    items:[],
    methods: {
        /* Adding the items to the shopping cart. */
        add:(id, stock) => {
            const cartItem = shoppingCart.methods.get(id);
            if(cartItem){
                if(shoppingCart.methods.Inventory(id, stock + cartItem.stock)){
                    cartItem.stock++;
                }
                else{
                    alert("no hay stock disponible")
                } 
            }else {
                shoppingCart.items.push({id, stock})
            }
        },
        /* Removing the items from the shopping cart. */
        remove:(id, stock) => {
            const cartItem = shoppingCart.methods.get(id);
            if(cartItem.stock - 1 > 0) {
                cartItem.stock--;
            } else {
                shoppingCart.items = shoppingCart.items.filter((item) => item.id !== id);
            }
        },
        /* Counting the items in the shopping cart. */
        conut:() => {
            return shoppingCart.items.reduce((acc, item) => acc + item.stock, 0);
        },
        /* A function that returns the index of the item in the shopping cart. */
        get:(id) => {
            const index = shoppingCart.items.findIndex((item) => item.id === id);
            return index >= 0 ? shoppingCart.items[index] : null;
        },
        /* A function that returns the total of the shopping cart. */
        getTotal:() => {
           
           const total = shoppingCart.items.reduce((acc, item) =>{
                const found = db.methods.find(item.id);
                return acc + found.price * item.stock;
           }, 0)
           return total;
        },
        /* Checking if the stock is available. */
        Inventory:(id, stock) => {
            return db.items.find((item) => item.id === id).stock - stock >= 0;
        },
        /* Removing the items from the database. */
        purchase:() => {
            db.methods.remove(shoppingCart.items);
            shoppingCart.items = [];
        },
    }
}


/**
 * The renderStore function is a function that renders the store, it takes the items from the database
 * and creates a div for each item, then it adds the image, title, price, stock and actions to each
 * div, then it adds the divs to the storeContainer div, then it adds an event listener to each add
 * button that adds the item to the shopping cart and renders the shopping cart.
 */
function renderStore(){
    const html = db.items.map((item) => {
        return `
            <div class="item">
                <div class="img"><img src="./Multimedia/${item.img}" alt=""></div>
                <div class="title">${item.title}</div>
                <div class="price">$${item.price}</div>
                <div class="stock">${item.stock} Unidades Disponibles</div>

                <div class="actions">
                    <button class="add" data-id="${item.id}">Agregar al carrito</button>
                </div>
            </div>
        `;
    });
    
    document.querySelector("#storeContainer").innerHTML = html.join("");

    document.querySelectorAll('.item .actions .add').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute("data-id"));
            const item = db.methods.find(id);

            if(item && item.stock -1 > 0){
                shoppingCart.methods.add(id, 1);
                renderShoppingCart();
            } else{
                alert("no hay inventario")
            }
        })
    })
}
renderStore();
    
/**
 * The function renders the shopping cart by mapping the items in the shopping cart to the items in the
 * database, and then joining them together with the close button, the total container, and the
 * purchase button.
 */
function renderShoppingCart(){
    const html = shoppingCart.items.map((item) => {
        const dbItem = db.methods.find(item.id);
        return `
        <div class="item">
            <div class="img"><img src="./Multimedia/${dbItem.img}" alt=""></div>
            <div class="title">${dbItem.title}</div>
            <div class="price">$${dbItem.price}</div>
            <div class="stock">${item.stock} Unidades</div>
            <div class="subtotal">Subtotal: ${(item.stock * dbItem.price)} Unidades</div>

            <div class="actions">
                <button class="addOne" data-id="${item.id}">+</button>
                <button class="removeOne" data-id="${item.id}">-</button>
            </div>
        </div>
        `;
    });

    const closeButton = `
        <div class="cartHeader">
            <button class="bClose">Close</button>
        </div>
    `;

    const purchaseButton = shoppingCart.items.length > 0 
        ?
        `
        <div class="cartActions">
            <button class="bPurchase">Terminar Compra</button>
        </div>
    ` 
    :"";

    const total = shoppingCart.methods.getTotal();
    const totalContainer = `<div class="total">Total: ${total}</div> `;

    const shoppingCartContainer = document.querySelector('#shoppingContainer');
    shoppingCartContainer.innerHTML = closeButton + html.join("") + totalContainer + purchaseButton;

    document.querySelectorAll('.addOne').forEach((button) => {
        button.addEventListener('click',(e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
    })

    document.querySelectorAll('.removeOne').forEach((button) => {
        button.addEventListener('click',(e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
    })

    document.querySelector('.bClose').addEventListener('click', (e) => {
        document.querySelector('#shoppingContainer').classList.remove("show");
        document.querySelector('#shoppingContainer').classList.add("hide");
    })

    const bPurchase = document.querySelector('.bPurchase');
    if(bPurchase){
        bPurchase.addEventListener('click', (e) => {
            shoppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        })
    } 
}


