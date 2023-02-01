const Cart = require("../models/carts.model");

// create cart for userId and add item into it.
exports.createCart = async(payload) => {
    const newCartForUser = await Cart.create(payload);
    return newCartForUser;
}

// return current cart based on userId here
exports.cart = async(userId) => {
    const currentCart = await Cart.find({ "userId": `${userId}` }).populate('items.productId');
    return currentCart;
};

// item already exists, update quantity, total and subTotal of existing product
exports.updateItemToCart = async(userId, productId, quantity, price, total, subTotal) => {
    let query = {
        userId: userId,
        "items.productId": productId
    }

    let update = {
        $set: {
            "items": [{
                productId: productId,
                quantity: quantity,
                price: price,
                total: total
            }],
            "subTotal": subTotal
        }
    }
    const updatedCart = await Cart.findOneAndUpdate(query, update, { new: true, upsert: true });
    return updatedCart;
};

// item not exist in cart, add item with provided quantity
exports.addItemToCart = async(userId, itemData, subTotal) => {
    const updatedCart = await Cart.findOneAndUpdate({ "userId": `${userId}` }, { $addToSet: { items: itemData }, subTotal: subTotal }, { new: true, upsert: true }); // new: true -> return updated document; upsert=update or insert
    return updatedCart;
};

// delete item from cart
exports.deleteItemFromCart = async(userId, productId, amountToUpdateInSubTotal) => {
    const updatedCart = await Cart.findOneAndUpdate({ "userId": `${userId}` }, {
        $pull: {
            items: {
                productId: productId
            }
        },
        $set: {
            subTotal: amountToUpdateInSubTotal
        }
    }, { new: true });

    return updatedCart;
}