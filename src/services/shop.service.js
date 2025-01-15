import LocalSource from "@/datasource/controller";
import {v4 as uuidv4} from 'uuid';

async function shopLoginFromLocalSource(data) {
    return LocalSource.shopLogin(data)
}

async function getAllVirusesFromLocalSource() {
    return LocalSource.getAllViruses()
}

async function shopLogin(data) {
    let response = null;
    try {
        response = await shopLoginFromLocalSource(data)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur reseau, impossible de se log'}
    }
    return response
}

async function getAllViruses() {
    let response = null;
    try {
        response = await getAllVirusesFromLocalSource()
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur reseau, impossible de get tout les viruses'}
    }
    return response
}

async function updateBasket(user, basket) {
    console.log(`maj du basket pour ${user.name} avec les données :`, basket);
    return {error: 0, data: basket}
}

async function createOrderFromBasket(shopUser) {
    const uuid = uuidv4();
    return {
        items: shopUser.basket.items,
        date: new Date(),
        amount: shopUser.basket.items.reduce((acc, item) => acc + item.amount * item.item.price, 0),
        status: 'waiting_payment',
        uuid: uuid
    }
}

async function verifyOrder(orderId, userId) {
    const orders = await LocalSource.getOrder(userId);
    return orders.find(order => order.id === orderId);
}

async function getOrder(userId) {
    return LocalSource.getOrder(userId);
}


export default {
    shopLogin,
    getAllViruses,
    updateBasket,
    createOrderFromBasket,
    verifyOrder,
    getOrder
}
