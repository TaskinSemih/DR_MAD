import LocalSource from "@/datasource/controller";


async function getAccountAmountFromLocalSource(number) {
    return LocalSource.getAccountAmount(number)
}

async function getAccountAmount(number) {
    let response;
    try {
        response = await getAccountAmountFromLocalSource(number)
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le solde du compte'}
    }
    console.log(response)
    return response
}

async function getAccountFromLocalSource(number) {
    return LocalSource.getAccount(number)
}

async function getAccount(number) {
    let response;
    try {
        response = await getAccountFromLocalSource(number)
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le compte'}
    }
    console.log(response)
    return response

}

async function getTransactionsFromLocalSource(number) {
    return LocalSource.getTransactions(number)
}

async function getTransactions(number) {
    let response;
    try {
        response = await getTransactionsFromLocalSource(number)
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions'}
    }
    console.log(response)
    return response
}

async function createWithdrawFromLocalSource(id_account, amount) {
    return LocalSource.createWithdraw(id_account, amount)
}

async function createWithdraw(id_account, amount) {
    let response;
    try {
        response = await createWithdrawFromLocalSource(id_account, amount)
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de réaliser le retrait'}
    }
    console.log(response)
    return response
}

async function createPaymentFromLocalSource(id_account, amount, destination) {
    return LocalSource.createPayment(id_account, amount, destination)
}

async function createPayment(id_account, amount, destination) {
    let response;
    try {
        response = await createPaymentFromLocalSource(id_account, amount, destination)
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de réaliser le paiement'}
    }
    console.log(response)
    return response
}

export default {
    getAccountAmount, getTransactions, createWithdraw, createPayment, getAccount
}