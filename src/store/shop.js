import ShopService from '../services/shop.service'
import router from "@/router";

const state = () => ({
    viruses: [], shopUser: {},
})

const mutations = {
    updateViruses(state, viruses) {
        console.log('shop.js - updateViruses');

        state.viruses = viruses
    },

    updateShopUser(state, user) {
        console.log('shop.js - updateShopUser');
        state.shopUser = user
    },

    updateBasket(state, basket) {
        console.log('shop.js - updateBasket');
        state.shopUser.basket = basket
    },

    addItemToBasket(state, { item, amount }) {
        console.log('shop.js - addItemToBasket');

        // Vérification du stock total demandé
        const existingItem = state.shopUser.basket.items.find(i => i.item._id === item._id);
        const currentAmountInBasket = existingItem ? existingItem.amount : 0;
        const totalRequested = currentAmountInBasket + amount;

        if (totalRequested > item.stock) {
            throw new Error('Stock insuffisants'); // Déclenche une erreur si le stock est dépassé
        }

        // Ajout ou mise à jour de l'item dans le panier
        if (existingItem) {
            existingItem.amount += amount;
        } else {
            state.shopUser.basket.items.push({ item, amount });
        }
    },

    removeItemFromBasket(state, item) {
        console.log('shop.js - removeItemFromBasket');
        const index = state.shopUser.basket.items.indexOf(item);
        state.shopUser.basket.items.splice(index, 1);
    },
    createOrder(state, order) {
        state.shopUser.orders.push(order);
    },
}

const actions = {
    async shopLogin({commit}, data) {
        console.log('shop.js - shopLogin');
        let response = await ShopService.shopLogin(data)
        console.log(response.data)
        if (response.error === 0) {
            console.log(response.data)
            await commit('updateShopUser', response.data)
            await router.push('/shop/buy')
            console.log(state.shopUser)
        } else {
            console.log("erreur de login")
            console.log(response.data)
        }
    },
    logout({commit}) {
        console.log('shop.js - logout');
        commit('updateShopUser', {});
        console.log(state.shopUser);
    },

    async getAllViruses({commit}) {
        console.log('shop.js - getAllViruses');
        let response = await ShopService.getAllViruses()
        if (response.error === 0) {
            commit('updateViruses', response.data)
        } else {
            console.log(response.data)
        }
    },
    async updateBasket({commit, state}, basket) {
        console.log('shop.js - updateBasket');
        let response = await ShopService.updateBasket(state.shopUser, state.shopUser.basket)
        if (response.error === 0) {
            commit('updateBasket', basket)
        } else {
            console.log(response.data)
        }
    },
    async addToBasket({ commit, state }, { item, amount }) {
        console.log('shop.js - addToBasket');

        try {
            // Appelle la mutation avec vérification du stock
            commit('addItemToBasket', { item, amount });

            // Mise à jour du panier côté BDD
            let response = await ShopService.updateBasket(state.shopUser, state.shopUser.basket);
            if (response.error === 0) {
                commit('updateBasket', state.shopUser.basket);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error('Erreur :', error.message);
            alert(error.message); // Affiche une alerte en cas d'erreur
        }
    },
    
    async removeItemFromBasket({commit}, item) {
        console.log('shop.js - removeItemFromBasket');
        commit('removeItemFromBasket', item);
    },

    async clearBasket({state}) {
        console.log('shop.js - clearBasket');
        state.shopUser.basket.items = [];
    },
    async cancelOrder({state}, orderId) {
        console.log('shop.js - cancelOrder');
        const index = state.shopUser.orders.findIndex(order => order.id === orderId);
        if (index === -1) {
            state.shopUser.orders.splice(index, 1);
        }
        console.log(index);
    },

    async createOrder({commit, state}) {
        console.log('shop.js - createOrder');
        const order = await ShopService.createOrderFromBasket(state.shopUser);
        commit('createOrder', order);
        return order;
    },
    async finalizeOrder({state, commit}, orderId) {
        console.log('shop.js - finalizeOrder');
        let order = state.shopUser.orders.find(order => order.id === orderId);
        if (!order) {
            order = await ShopService.verifyOrder();
        }
        if (!order) {
            throw new Error('Invalid order id');
        }
        commit('finalizeOrder', order);
    }
}

const getters = {
    currentBasket: (state) => {
        console.log('shop.js - currentBasket');
        console.log(state.shopUser.basket);
        return state.shopUser ? state.shopUser.basket : [];
    },
}
export default {
    state, mutations, actions, getters
}

