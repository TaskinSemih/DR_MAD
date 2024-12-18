import BankService from '../services/bankaccount.service'

const state = () => ({
    accountNumber: '',
    accountAmount: 0,
    accountTransactions: [],
    accountNumberError: 0,
})

const mutations = {
    updateAccountAmount(state, amount) {
        state.accountAmount = amount
    },
    updateTransactions(state, transactions) {
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
        console.log('récupération du solde du compte');
        let response = await BankService.getAccountAmount(number)
        console.log("je suis dans le store de la bank dans getAccountAmount")
        console.log("salut " + response.data)
        if (response.error === 0) {
            commit('updateAccountAmount', response.data)
            commit('updateAccountNumberError', 1)
        } else {
            console.log(response.data)
            commit('updateAccountNumberError', -1)
        }
    },
    async getTransactions({commit}, number) {
        console.log('récupération des transactions');
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
        console.log('récupération du compte');
        let response = await BankService.getAccount(number)
        console.log(response)
        commit('updateAccountNumber', response.data)
    },
    async resetAccountNumber({commit}) {
        commit('updateAccountNumber', '')
        commit('updateAccountNumberError', 0)
        commit('updateAccountAmount', 0)
    },
    async createWithdraw({commit}, {id_account, amount}) {
        console.log('création du retrait');
        let response = await BankService.createWithdraw(id_account, amount)
        console.log(response)
        commit('updateAccountAmount', response.data.amount)
        commit('updateTransactions', response.data.transactions)
    },
    async createPayment({commit}, {id_account, amount, destination}) {
        console.log('création du paiement');
        let response = await BankService.createPayment(id_account, amount, destination)
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log(response)
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log(response.data)
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log("je suis dans le store de la bank dans createPayment et je suis mort")
        commit('updateAccountAmount', response.data.amount)
        commit('updateTransactions', response.data)
    }
}

export default {
    state,
    mutations,
    actions
}
