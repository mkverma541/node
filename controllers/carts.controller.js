const cartRepository = require("./cart.repository");
const productRepository = require("./products.repository");
const userRepository = require("./user.repository");

exports.addItemToCart = async(req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = Number.parseInt(req.body.quantity);
    console.log(productId)

    try {
        let product = await productRepository.productById(productId);
        console.log(product)
        if (!product) {
            return res.status(500).json({
                status: 'fail',
                response: "Product Not Found",
                msg: "Invalid request"
            });
        }

        let cart = await cartRepository.cart(userId);

        // If cart doesn't exist for given userId then will create new cart and add the product into it.
        if (cart == "") {
            try {
                if (quantity <= product.quantity) {
                    const cartData = {
                        userId: userId,
                        items: [{
                            productId: productId,
                            quantity: quantity,
                            total: parseInt(product.price * quantity),
                            price: product.price
                        }],
                        subTotal: parseInt(product.price * quantity)
                    }
                    let updatedCart = await cartRepository.createCart(cartData);
                    // update product quantity in product repository
                    let updatedProduct = await productRepository.updateProductQuantity(productId, (product.quantity - quantity));

                    return res.status(200).json({
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });
                } else {
                    return res.status(500).json({
                        status: 'success',
                        msg: "Unsufficient quantity entered! A"
                    });
                }
            } catch (err) {
                console.log(err)
                return res.status(400).json({
                    status: "fail",
                    msg: "Something Went Wrong",
                    err: err
                })
            }
        }

        // cart exists for userId, will fetch items and update that array accordingly
        else {
            // console.log("length of items of cart[0] : " + cart[0].items?.length);
            let indexFound = cart[0].items.findIndex(item => item.productId._id == productId);
            console.log(indexFound, 'Index A =>')

            if (indexFound !== -1) {
                console.log('called 1')
                if (quantity > 0) {
                    let productQuantity = parseInt(cart[0].items[indexFound].quantity) + quantity;
                    let productPrice = parseInt(product.price);
                    let totalProductAmount = parseInt(productQuantity * productPrice);

                    const subTotal = parseInt(cart[0].subTotal) + parseInt(product.price * quantity);

                    let updatedCart = await cartRepository.updateItemToCart(userId, productId, productQuantity, productPrice, totalProductAmount, subTotal);
                    // update product quantity in product repository
                    let updatedProduct = await productRepository.updateProductQuantity(productId, (product.quantity - quantity));
                    // cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);

                    return res.status(200).json({
                        status: 'success',
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });

                } else {
                    return res.status(500).json({
                        status: 'fail',
                        msg: "Unsufficient quantity entered! B"
                    });
                }
            }

            // -1 means if match index not found
            // product doesn't exist in cart, so adding it to items array
            else if (indexFound == -1) {
                console.log(indexFound, 'called 2')
                if (quantity <= product.quantity) {
                    const itemData = {
                        productId: productId,
                        quantity: quantity,
                        price: product.price,
                        total: parseInt(product.price * quantity),
                    }
                    const subTotal = parseInt(cart[0].subTotal) + parseInt(product.price * quantity);

                    let updatedCart = await cartRepository.addItemToCart(userId, itemData, subTotal);
                    // update product quantity in product repository
                    let updatedProduct = await productRepository.updateProductQuantity(productId, (product.quantity - quantity));

                    return res.status(200).json({
                        status: 'success',
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });
                } else {
                    return res.status(500).json({
                        status: 'fail',
                        msg: "Unsufficient quantity entered!"
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong for addItemToCart",
            err: err
        });
    }

}

exports.viewCart = async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await userRepository.userById(userId);
        const cart = await cartRepository.cart(userId);
        console.log("user : " + user);
        console.log("cart : " + cart);
        if (!user) {
            return res.status(400).json({
                status: "faild",
                response: "User not found!"
            })
        } else if (cart == "") {
            return res.status(400).json({
                msg: "Cart is empty!"
            })
        } else {
            return res.status(200).json({
                status: 'success',
                data: cart
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong!",
            err: err
        });
    }
}

exports.removeFromCart = async(req, res) => {
    try {
        const userId = req.params.id;
        const productId = req.body.productId;

        const cart = await cartRepository.cart(userId);
        const product = await productRepository.productById(productId);

        // search productId in the items
        let indexFound = cart[0].items.findIndex(item => item.productId == productId);

        if (indexFound !== -1) {
            const amountToUpdateInSubTotal = parseInt(cart[0].subTotal) - parseInt(cart[0].items[indexFound].total);
            const updatedCart = await cartRepository.deleteItemFromCart(userId, productId, amountToUpdateInSubTotal);

            // update product quantity in product repository
            const updatedQuantity = parseInt(product.quantity) + parseInt(cart[0].items[indexFound].quantity);
            const updatedProduct = await productRepository.updateProductQuantity(productId, updatedQuantity);

            return res.status(200).json({
                status: "success",
                updatedCart: updatedCart,
                updatedProduct: updatedProduct
            })
        } else {
            return res.status(500).json({
                status: "Invalid",
                msg: "Item doesn't exist in cart!"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong!",
            err: err
        });
    }
}