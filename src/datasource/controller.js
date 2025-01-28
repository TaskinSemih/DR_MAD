import {bankaccounts, items, shopusers, transactions} from './data'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'; // Import de bcryptjs




function shopLogin(data) {
    if (!data.login || !data.password)
        return { error: 1, status: 404, data: 'aucun login/pass fourni' };

    const user = shopusers.find((e) => e.login === data.login);

    if (!user) return { error: 1, status: 404, data: 'login incorrect' };

    const passwordMatches = bcrypt.compareSync(data.password, user.password);
    if (!passwordMatches) {
        return { error: 1, status: 404, data: 'mot de passe incorrect' };
    }

    if (!user.uuid) {
        user.uuid = uuidv4();
    }

    if (!user.basket) {
        user.basket = { items: [] };
    }

    return {
        error: 0,
        status: 200,
        data: {
            name: user.name,
            login: user.login,
            email: user.email,
            session: user.session,
            basket: user.basket,
            orders: user.orders,
            uuid: user.uuid,
        },
    };
}

function getAllViruses() {
    return {error: 0, data: items}
}

function getOrder(orderId, userId) {
    const orders = shopusers.find(user => user.id === userId).orders;
    return orders.find(order => order.id === orderId);
}

function getAccountAmount(number) {
    if (number === undefined || number === "") return {error: 1, status: 404, data: 'empty number'}
    console.log("number : " + number)
    let account = bankaccounts.find(e => e.number === number)
    console.log("compte : " + account)
    if (!account) return {error: 1, status: 404, data: 'unknown account'}
    return {error: 0, data: account.amount}
}



function getAccount(number) {
    console.log("controller.js - getAccount")
    if (number === "" || number === undefined) return {error: 1, status: 404, data: 'empty number'};
    const res = bankaccounts.find((account) => account.number === number);
    if (!res) return {error: 1, status: 404, data: 'account dont exists'};
    res.transactions = transactions.filter((trans) => trans.account === res._id || trans.destination === res._id);
    return {error: 0, status: 200, data: res};
}

function getTransactions(id_account) {
    console.log("controller.js - getTransactions")
    if (id_account === "" || id_account === undefined) return {error: 1, status: 404, data: 'empty number'};
    const res = transactions.filter((trans) => trans.account === id_account || trans.destination === id_account);
    if (!res) return {error: 1, status: 404, data: 'account doesn"t exists'};
    return {error: 0, status: 200, data: res};
}

function createWithdraw(id_account, amount) {
    console.log("controller.js - createWithdraw")
    const account = bankaccounts.find(e => e._id === id_account);
    if (!account) return {error: 1, status: 404, data: 'invalid account id'};

    if (amount <= 0 || account.amount < amount) return {
        error: 1, status: 404, data: 'invalid amount or insufficient balance'
    };

    const transaction = {
        _id: uuidv4(),
        amount: -amount,
        account: id_account,
        destination: null,
        date: {"$date": new Date().toISOString()},
        uuid: uuidv4()
    };

    console.log(transaction)
    account.transactions.push(transaction);

    account.amount -= amount;

    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};
}

function createPayment(id_account, amount, destination) {
    try {
        console.log("controller.js - createPayment")
        const account = bankaccounts.find(e => e._id === id_account);
        console.log("account : " + account)
        const destinationAccount = bankaccounts.find(e => e._id === destination);
        console.log("destinationAccount : " + destinationAccount)
        if (!account) return {error: 1, status: 404, data: 'invalid account id'};
        if (!destination) return {error: 1, status: 404, data: 'invalid destination'};

        if (amount <= 0 || account.amount < amount) return {
            error: 1, status: 404, data: 'invalid amount or insufficient balance'
        };

        const transaction = {
            _id: uuidv4(),
            amount: -amount,
            account: id_account,
            destination: destination,
            date: {"$date": new Date().toISOString()},
            uuid: uuidv4()
        };

        account.transactions.push(transaction);

        account.amount -= Number(amount);
        destinationAccount.amount += Number(amount);

        return {
            error: 0, status: 200, data: {
                _id: account._id,
                uuid: transaction.uuid,
                amount: amount,
                destination: destinationAccount.number,
                date: transaction.date,
                // transaction: transaction
            }
        };
    } catch (error) {
        console.error('Erreur lors de la création du paiement :', error);
        return {error: 1, status: 500, data: 'An error occurred while creating the payment'};
    }
}


export default {
    shopLogin, getAllViruses, getAccountAmount, getTransactions, getOrder, getAccount, createWithdraw, createPayment
}