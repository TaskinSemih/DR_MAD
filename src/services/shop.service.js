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

    // Calcul du montant total en appliquant les promotions
    const totalAmount = shopUser.basket.items.reduce((acc, item) => {
        let price = item.item.price;  // Prix de base
        let quantity = item.amount;

        // Vérifier si des promotions existent
        if (item.item.promotion && item.item.promotion.length > 0) {
            let bestDiscount = 0;

            // Parcourir toutes les promotions et trouver la meilleure applicable
            item.item.promotion.forEach(promo => {
                if (quantity >= promo.amount) {
                    bestDiscount = Math.max(bestDiscount, promo.discount);
                }
            });

            // Appliquer la meilleure réduction trouvée
            price = price - (price * (bestDiscount / 100));
        }

        return acc + (price * quantity);
    }, 0);

    return {
        items: shopUser.basket.items,
        date: new Date(),
        amount: Math.round(totalAmount),  // ✅ Arrondi pour éviter les problèmes de virgule
        status: 'waiting_payment',
        uuid: uuid
    };
}


async function verifyOrder(orderId, userId) {
    const orders = await LocalSource.getOrder(userId);
    return orders.find(order => order.id === orderId);
}

async function getOrder(userId) {
    return LocalSource.getOrder(userId);
}

export async function finalizeUserOrder(userId, orderId, transactionUuid) {
    console.log("userId", userId)
    let response;
    try {
        response = await finalizeUserOrderFromLocalSource(userId, orderId, transactionUuid);
    } catch (err) {
        response = {error: 1, status: 404, data: 'Erreur réseau, impossible de finaliser la commande'};
    }
    return response;
}
async function finalizeUserOrderFromLocalSource(userId, orderId, transactionUuid) {
    return LocalSource.finalizeUserOrder(userId, orderId, transactionUuid);
}


export default {
    shopLogin,
    getAllViruses,
    updateBasket,
    createOrderFromBasket,
    verifyOrder,
    getOrder
}
