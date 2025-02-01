import BankService from '../services/bankaccount.service'

const state = () => ({
    accountNumber: {}, 
    accountAmount: 0,
    accountTransactions: [],
    accountNumberError: 0,
})


const mutations = {
    updateAccountAmount(state, amount) {
        state.accountAmount = amount
    },
    updateTransactions(state, transactions) {
        console.log("🔍 Ajout d'une transaction dans Vuex :", transactions);
        state.accountTransactions.push(transactions)
    },
    updateAccountNumberError(state, error) {
        state.accountNumberError = error
    },
    updateAccountNumber(state, number) {
        state.accountNumber = number
    }
}


const actions = {
    async getAccountAmount({commit}, number) {
        console.log('bank.js - getAccountAmount');
        let response = await BankService.getAccountAmount(number)
        if (response.error === 0) {
            commit('updateAccountAmount', response.data)
            commit('updateAccountNumberError', 1)
        } else {
            console.log(response.data)
            commit('updateAccountNumberError', -1)
        }
    },

    async getTransactions({commit}, number) {
        console.log('bank.js - getTransactions');
        let response = await BankService.getTransactions(number)
        console.log(response)

        if (response.error === 0) {
            commit('updateTransactions', response.data)
            commit('updateAccountNumberError', 1)
        } else {
            console.log(response.data)
            commit('updateAccountNumberError', -1)
        }
    },

    async getAccount({commit}, number) {
        console.log('bank.js - getAccount');
        let response = await BankService.getAccount(number)
        console.log(response)
        commit('updateAccountNumber', response.data)
    },
    async resetAccountNumber({commit}) {
        console.log('bank.js - resetAccountNumber');
        commit('updateAccountNumber', '')
        commit('updateAccountNumberError', 0)
        commit('updateAccountAmount', 0)
    },
    async createWithdraw({commit}, {id_account, amount}) {
        let response = await BankService.createWithdraw(id_account, amount)
        console.log(response)
        commit('updateAccountAmount', response.data.amount)
        commit('updateTransactions', response.data.transactions)
    },

    async createPayment({commit}, {id_account, amount, destination}) {
        console.log('bank.js - createPayment');
        let response = await BankService.createPayment(id_account, amount, destination)
        console.log(response)
        console.log(response.data)

        commit('updateAccountAmount', response.data.amount)
        commit('updateTransactions', response.data)
    }
}

export default {
    state,
    mutations,
    actions
}
