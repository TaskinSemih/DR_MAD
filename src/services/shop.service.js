import LocalSource from "@/datasource/controller";
import {v4 as uuidv4} from 'uuid';

async function shopLoginFromLocalSource(data) {
    // rÃ©cupÃ©ration auprÃ¨s de la source locale
    return LocalSource.shopLogin(data)
}

/*
async function shopLoginFromAPI(data) {
  // a Ã©crire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
    // rÃ©cupÃ©ration auprÃ¨s de la source locale
    return LocalSource.getAllViruses()
}

/*
async function getAllVirusesFromAPI() {
  // a Ã©crire quand l'API est fonctionnelle
  return {}
}
*/

async function shopLogin(data) {
    let response = null;
    try {
        // changer la mÃ©thode appelÃ©e quand cette fonctionnalitÃ© l'API est prÃªte
        response = await shopLoginFromLocalSource(data)
    }
        // NB: le catch n'aura lieu que pour des requÃªte vers l'API, s'il y a une erreur rÃ©seau
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de se loguer'}
    }
    return response
}


async function getAllViruses() {
    let response = null;
    try {
        // changer la mÃ©thode appelÃ©e quand cette fonctionnalitÃ© l'API est prÃªte
        response = await getAllVirusesFromLocalSource()
    }
        // NB: le catch n'aura lieu que pour des requÃªte vers l'API, s'il y a une erreur rÃ©seau
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer la liste des viruses'}
    }
    return response
}

async function updateBasket(user, basket) {
    console.log(`mise à jour du panier pour l'utilisateur ${user.name} avec les données suivantes :`, basket);
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