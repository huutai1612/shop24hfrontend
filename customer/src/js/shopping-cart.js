// FIXME: sua api
$(document).ready(() => {
    let gProduct = JSON.parse(localStorage.getItem('products'));
    let gOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));

    function getProduct() {
        $('.cart-table tbody').html('');
        if (gProduct) {
            gProduct.forEach((productId, index) => {
                $.ajax({
                    url: `http://localhost:8080/products/${productId}`,
                    method: 'get',
                    async: false,
                    dataType: 'json',
                    success: (product) => {
                        renderProduct(product, index, gOrderDetail[index]);
                    },
                    error: (e) => alert(e.responseText),
                });
            });
        }
    }
    getProduct();

    // render product
    function renderProduct(paramProduct, paramIndex, paramOrderDetail) {
        let vResult = `
		<tr>
			<td class="cart-pic first-row">
				<img style="width:168px; height:168px" src="${
                    paramProduct.urlImage
                }" alt="product">
			</td>
			<td class="cart-title first-row">
				<h5>${paramProduct.productName}</h5>
			</td>
			<td class="p-price first-row">${paramOrderDetail.priceEach}</td>
			<td class="qua-col first-row">
				<div class="quantity">
					<div class="pro-qty"><span class="dec qtybtn">-</span>
						<input class="inp-quantity" type="text" value="${
                            paramOrderDetail.quantityOrder
                        }">
					<span class="inc qtybtn">+</span></div>
				</div>
			</td>
			<td class="total-price first-row">${
                paramOrderDetail.priceEach * paramOrderDetail.quantityOrder
            } VNĐ</td>
			<td class="close-td first-row"><i  data-index="${paramIndex}" class="ti-close"></i></td>
		</tr>
		`;
        $('.cart-table tbody').append(vResult);
    }

    function addEventListenerForIncreaseAndDecrease() {
        let gDecreaseInput = $('.dec');
        let gIncreaseInput = $('.inc');
        let gInputElement = document.querySelectorAll('.inp-quantity');
        // decrease
        for (let i = 0; i < gDecreaseInput.length; i++) {
            gDecreaseInput[i].addEventListener('click', () =>
                onDecreaseProductClick(gInputElement[i], i)
            );
        }

        function onDecreaseProductClick(paramInputElement, paramIndex) {
            console.log(paramIndex);
            if (paramInputElement.value < 2) {
                paramInputElement.value = 1;
            }
            gOrderDetail[paramIndex].quantityOrder = parseInt(
                --paramInputElement.value
            );
            localStorage.setItem('orderDetail', JSON.stringify(gOrderDetail));
            $('.select-items tbody').html('');
            gProduct = JSON.parse(localStorage.getItem('products'));
            gOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));
            getProduct();
            addEventListenerForIncreaseAndDecrease();
        }
        // increase
        for (let i = 0; i < gIncreaseInput.length; i++) {
            gIncreaseInput[i].addEventListener('click', () =>
                onIncreaseProductClick(gInputElement[i], i)
            );
        }

        function onIncreaseProductClick(paramInputElement, paramIndex) {
            gOrderDetail[paramIndex].quantityOrder = parseInt(
                ++paramInputElement.value
            );
            localStorage.setItem('orderDetail', JSON.stringify(gOrderDetail));
            $('.select-items tbody').html('');
            gProduct = JSON.parse(localStorage.getItem('products'));
            gOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));
            getProduct();
            addEventListenerForIncreaseAndDecrease();
        }
    }
    addEventListenerForIncreaseAndDecrease();

    // on load cart number function
    function onLoadCartNumber() {
        let productNumber = localStorage.getItem('cartNumbers');
        if (productNumber) {
            $('.cart-icon span').text(productNumber);
        }
    }

    onLoadCartNumber();
    // function load cart product
    function loadProductToCart() {
        let vProduct = JSON.parse(localStorage.getItem('products'));
        let vOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));
        if (vProduct) {
            vProduct.forEach((productId, index) => {
                $.ajax({
                    url: `http://localhost:8080/products/${productId}`,
                    method: 'get',
                    dataType: 'json',
                    success: (product) => {
                        renderProductToCart(
                            product,
                            index,
                            vOrderDetail[index]
                        );
                    },
                    error: (e) => alert(e.responseText),
                });
            });
        }
    }
    loadProductToCart();

    // render product to cart
    function renderProductToCart(paramProduct, paramIndex, paramOrderDetail) {
        let vResult = `
			<tr>
				<td class="si-pic">
					<img style="width:72px; height:72px"
						src="${paramProduct.urlImage}"
						alt="product"
					/>
				</td>
				<td class="si-text">
					<div class="product-selected">
						<p>${paramProduct.buyPrice} VNĐ x ${paramOrderDetail.quantityOrder}</p>
						<h6>${paramProduct.productName} </h6>
					</div>
				</td>
				<td class="si-close">
					<i data-index="${paramIndex}" class="ti-close"></i>
				</td>
			</tr>
			`;
        $('.select-items tbody').append(vResult);
    }

    // delete product
    $(document).on('click', '.ti-close', (e) => {
        let vIndex = parseInt(e.target.dataset.index);

        // set product number
        let productNumber = localStorage.getItem('cartNumbers');
        productNumber = parseInt(productNumber);
        localStorage.setItem('cartNumbers', --productNumber);
        $('.cart-icon span').text(productNumber);
        $('.select-items tbody').html('');

        // set product
        let vProduct = JSON.parse(localStorage.getItem('products'));
        vProduct.splice(vIndex, 1);
        localStorage.setItem('products', JSON.stringify(vProduct));

        // set order detail
        let vOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));
        vOrderDetail.splice(vIndex, 1);
        localStorage.setItem('orderDetail', JSON.stringify(vOrderDetail));
        loadProductToCart();

        gProduct = JSON.parse(localStorage.getItem('products'));
        gOrderDetail = JSON.parse(localStorage.getItem('orderDetail'));
        getProduct();
        addEventListenerForIncreaseAndDecrease();
    });
});