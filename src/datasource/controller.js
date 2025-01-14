import {bankaccounts, items, shopusers, transactions} from './data'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'; // Import de bcryptjs


/* controllers: les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Ces paramètres sont généralement les mêmes qu'ils faudrait envoyer à l'API, mais pas forcément.

  Exemple 1 : se loguer aurpès de la boutique


 */

function shopLogin(data) {
    if (!data.login || !data.password)
        return { error: 1, status: 404, data: 'aucun login/pass fourni' };

    const user = shopusers.find((e) => e.login === data.login);

    console.log('je suis dans le controller pour shoplogin');
    console.log(user);

    if (!user) return { error: 1, status: 404, data: 'login incorrect' };

    // Vérification du mot de passe avec bcrypt
    const passwordMatches = bcrypt.compareSync(data.password, user.password);
    if (!passwordMatches) {
        return { error: 1, status: 404, data: 'mot de passe incorrect' };
    }

    // Génération d'UUID pour l'utilisateur s'il n'en a pas encore
    if (!user.uuid) {
        user.uuid = uuidv4();
    }

    // Initialisation du panier de l'utilisateur
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
    console.log("number " + number)
    let account = bankaccounts.find(e => e.number === number)
    console.log("je suis dans le getAccountAmount")
    console.log("compte ")
    console.log(account)
    if (!account) return {error: 1, status: 404, data: 'unknown account'}
    return {error: 0, data: account.amount}
}



function getAccount(number) {
    console.log("je get le compte, je suis dans le controller getAccount")
    if (number === "" || number === undefined) return {error: 1, status: 404, data: 'empty number'};
    const res = bankaccounts.find((account) => account.number === number);
    console.log(res)
    if (!res) return {error: 1, status: 404, data: 'account doesn"t exists'};

    res.transactions = transactions.filter((trans) => trans.account === res._id || trans.destination === res._id);

    console.log("je suis mort")
    return {error: 0, status: 200, data: res};
}

function getTransactions(id_account) {
    console.log("je récupère les transactions")
    if (id_account === "" || id_account === undefined) return {error: 1, status: 404, data: 'empty number'};
    const res = transactions.filter((trans) => trans.account === id_account || trans.destination === id_account);
    if (!res) return {error: 1, status: 404, data: 'account doesn"t exists'};
    console.log("je suis mort")
    return {error: 0, status: 200, data: res};
}

function createWithdraw(id_account, amount) {
    console.log("je suis dans le createWithdraw")
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
    transactions.push(transaction);

    account.amount -= amount;

    console.log("je suis mort")
    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};
}

function createPayment(id_account, amount, destination) {
    try {
        console.log("je suis dans le createPayment")
        const account = bankaccounts.find(e => e._id === id_account);
        console.log("compte ")
        console.log(account)
        const destinationAccount = bankaccounts.find(e => e._id === destination);
        console.log("destination ")
        console.log(destinationAccount)
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

        console.log(transaction)

        account.transactions.push(transaction);

        account.amount -= Number(amount);
        destinationAccount.amount += Number(amount);
        console.log("compte de destination")
        console.log(destinationAccount)

        console.log("je suis mort")
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