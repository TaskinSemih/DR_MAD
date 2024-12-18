import ShopService from '../services/shop.service'
import router from "@/router";

const state = () => ({
    viruses: [], shopUser: {},
})

const mutations = {
    updateViruses(state, viruses) {
        state.viruses = viruses
    },
    updateShopUser(state, user) {
        console.log('updating shop user');
        state.shopUser = user
    },
    updateBasket(state, basket) {
        state.shopUser.basket = basket
    },
    addItemToBasket(state, {item, amount}) {
        const existingItem = state.shopUser.basket.items.find(i => i.item === item);
        if (existingItem) {
            existingItem.amount += amount;
        } else {
            state.shopUser.basket.items.push({item, amount});
        }
    },
    removeItemFromBasket(state, item) {
        // marche pas
        // const index = state.shopUser.basket.items.findIndex(i => i.item === item);
        // if (index !== -1) {
        //     state.shopUser.basket.items.splice(index, 1);
        // }
        const index = state.shopUser.basket.items.indexOf(item);
        state.shopUser.basket.items.splice(index, 1);
    },
    createOrder(state, order) {
        state.shopUser.orders.push(order);
    },
}

const actions = {
    async shopLogin({commit}, data) {
        console.log('trying to log in');
        console.log('shopLogin action called with:', { data });
        let response = await ShopService.shopLogin(data)
        console.log("\"je suis dans le store de shop \" + ")
        console.log(response.data)
        console.log("JE SUIS MORT")
        if (response.error === 0) {
            console.log("je commit là")
            console.log(response.data)
            await commit('updateShopUser', response.data)
            console.log("------------------------------------")
            await router.push('/shop/buy')
            console.log("je suis loggé en tant que :")
            console.log(state.shopUser)
        } else {
            console.log("erreur de login")
            console.log(response.data)
        }
    },
    logout({commit}) {
        console.log('trying to log out');
        commit('updateShopUser', {});
        console.log(state.shopUser);
    },
    async getAllViruses({commit}) {
        console.log('récupération des viruses');
        let response = await ShopService.getAllViruses()
        if (response.error === 0) {
            commit('updateViruses', response.data)
        } else {
            console.log(response.data)
        }
    },
    async updateBasket({commit, state}, basket) {
        console.log('mise à jour du panier');
        let response = await ShopService.updateBasket(state.shopUser, state.shopUser.basket)
        if (response.error === 0) {
            commit('updateBasket', basket)
        } else {
            console.log(response.data)
        }
    },
    async addToBasket({commit, state}, {item, amount}) {
        commit('addItemToBasket', {item, amount});
        let response = await ShopService.updateBasket(state.shopUser, state.shopUser.basket);
        if (response.error === 0) {
            commit('updateBasket', state.shopUser.basket);
        } else {
            console.log(response.data);
        }
    },
    async removeItemFromBasket({commit}, item) {
        console.log('J"ai tué l"item');
        commit('removeItemFromBasket', item);
    },

    async clearBasket({state}) {
        console.log('je vide le panier');
        state.shopUser.basket.items = [];
    },
    async cancelOrder({state}, orderId) {
        console.log('je cancel la commande');
        const index = state.shopUser.orders.findIndex(order => order.id === orderId);
        if (index === -1) {
            state.shopUser.orders.splice(index, 1);
        }
        console.log(index);
    },

    async createOrder({commit, state}) {
        console.log('COUCOU JE PASSE COMMANDE');
        const order = await ShopService.createOrderFromBasket(state.shopUser);
        commit('createOrder', order);
        return order;
    },
    async finalizeOrder({state, commit}, orderId) {
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
        console.log('getting current basket');
        console.log(state.shopUser.basket);
        console.log("je suis mort");
        return state.shopUser ? state.shopUser.basket : [];
    },
}
export default {
    state, mutations, actions, getters
}

