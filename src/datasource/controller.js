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
            _id: user._id,
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

function getTransactions(id_account = null) {
    console.log("📥 controller.js - getTransactions | id_account:", id_account);

    if (id_account === "" || id_account === undefined || id_account === null) {
        console.warn("⚠ Aucun id_account fourni, récupération de toutes les transactions");
        console.log("📜 Liste complète des transactions AVANT retour :", transactions);
        return transactions;
    }

    const res = transactions.filter((trans) => trans.account === id_account || trans.destination === id_account);
    
    console.log(`🔎 Recherche des transactions pour id_account: ${id_account}`);
    console.log("📋 Transactions trouvées :", res);

    if (!res.length) {
        console.warn("❌ Aucune transaction trouvée pour cet ID de compte :", id_account);
        return { error: 1, status: 404, data: "Aucune transaction trouvée pour cet ID de compte" };
    }

    return res;
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
    console.log("🔄 controller.js - createPayment");

    // Vérification du compte source
    const account = bankaccounts.find(e => e._id === id_account);
    if (!account) {
        console.error("❌ Compte source inexistant !");
        return { error: 1, status: 404, data: "invalid account id" };
    }

    // Vérifier si destination est un numéro de compte et récupérer l'ID correspondant
    const destAccountObj = bankaccounts.find(e => e.number === destination);
    const destinationId = destAccountObj ? destAccountObj._id : null;

    console.log("✅ Destination trouvée :", destinationId);

    // Vérifier que le compte destination existe avec `_id`
    const destinationAccount = bankaccounts.find(e => e._id === destinationId);
    if (!destinationAccount) {
        console.error("❌ Compte destinataire inexistant !");
        return { error: 1, status: 404, data: "compte destinataire inexistant" };
    }

    console.log("📊 Compte source avant transaction :", { _id: account._id, solde: account.amount });
    console.log("📊 Compte destinataire avant transaction :", { _id: destinationAccount._id, solde: destinationAccount.amount });

    // 🔴 Vérifier si transactions existent
    if (!account.transactions) {
        console.warn("⚠️ `account.transactions` est undefined, initialisation...");
        account.transactions = [];
    }
    if (!destinationAccount.transactions) {
        console.warn("⚠️ `destinationAccount.transactions` est undefined, initialisation...");
        destinationAccount.transactions = [];
    }

    // Vérification du solde et du montant
    if (amount <= 0 || account.amount < amount) {
        console.error("❌ Montant invalide ou solde insuffisant !");
        return { error: 1, status: 404, data: "invalid amount or insufficient balance" };
    }

    console.log("📌 Création des transactions...");

    try {
        // Création des transactions
        const debitTransaction = {
            _id: uuidv4(),
            amount: -amount,
            account: id_account,
            destination: destinationId,
            date: { "$date": new Date().toISOString() },
            uuid: uuidv4()
        };

        const creditTransaction = {
            _id: uuidv4(),
            amount: amount,
            account: destinationId,
            destination: null,
            date: debitTransaction.date,
            uuid: uuidv4()
        };

        account.transactions.push(debitTransaction);
        destinationAccount.transactions.push(creditTransaction);
        transactions.push(debitTransaction, creditTransaction);
        console.log("📦 Liste ACTUELLE de toutes les transactions enregistrées :", transactions);


        // ✅ Ajout des logs ici, juste après avoir stocké les transactions
        console.log("💾 Transaction enregistrée (débit) :", debitTransaction);
        console.log("💾 Transaction enregistrée (crédit) :", creditTransaction);
        console.log("📦 Liste actuelle des transactions :", bankaccounts.flatMap(acc => acc.transactions || []));

        // Mise à jour des soldes des comptes
        account.amount -= amount;
        destinationAccount.amount += amount;

        console.log("💰 Nouveau solde compte source :", { _id: account._id, solde: account.amount });
        console.log("💰 Nouveau solde compte destinataire :", { _id: destinationAccount._id, solde: destinationAccount.amount });

        console.log("✅ Transaction de débit enregistrée :", debitTransaction);
        console.log("✅ Transaction de crédit enregistrée :", creditTransaction);

        console.log("📦 Transactions finales dans le compte source :", account.transactions);
        console.log("📦 Transactions finales dans le compte destinataire :", destinationAccount.transactions);

        const response = {
            error: 0,
            status: 200,
            data: {
                uuid: debitTransaction.uuid,
                amount: account.amount
            }
        };

        console.log("🚀 Réponse finale envoyée :", response);
        return response;

    } catch (error) {
        console.error("🔥 ERREUR SERVEUR :", error);
        return { error: 1, status: 500, data: "Erreur interne du serveur" };
    }

}


function finalizeUserOrder(userId, orderId, transactionUuid) {
    console.log("🚀 Début de la finalisation de commande...");

    // Vérification des paramètres
    if (!userId) return { error: 1, status: 404, data: "Aucun ID utilisateur fourni" };
    if (!orderId) return { error: 1, status: 404, data: "Aucun ID de commande fourni" };
    if (!transactionUuid) return { error: 1, status: 404, data: "Aucun UUID de transaction fourni" };

    // Recherche de l'utilisateur
    const user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

    // Recherche de la commande
    const order = user.orders?.find(o => o.uuid === orderId);
    if (!order) return { error: 1, status: 404, data: "Commande non trouvée" };

    // Vérification de l'état de la commande
    if (order.status === "finalized") return { error: 1, status: 400, data: "La commande est déjà finalisée" };

    console.log("✅ Vérification de la transaction UUID :", transactionUuid);

    // Récupération de toutes les transactions
    const allTransactions = getTransactions();
    console.log("📜 Transactions disponibles dans getTransactions():", allTransactions);

    console.log("🔍 Comparaison des transactions en mémoire avec celles dans getTransactions()");
    console.log("🔎 Transactions en mémoire :", bankaccounts.flatMap(acc => acc.transactions || []));
    console.log("📜 Transactions disponibles :", allTransactions.map(t => ({
        uuid: t.uuid,
        account: t.account,
        amount: t.amount,
        destination: t.destination
    })));

    // Recherche de la transaction par UUID
    const transaction = allTransactions.find(t => t.uuid === transactionUuid);
    if (!transaction) return { error: 1, status: 404, data: "Transaction non trouvée" };

    // 🔥 Log pour vérifier la commande complète
    console.log("🛍️ Commande trouvée :", order);

    // ✅ Vérification dynamique entre `order.total` et `order.amount`
    const orderTotal = order.total ?? order.amount;  // Si `order.total` est undefined, on prend `order.amount`

    if (!orderTotal) {
        console.error("⚠️ Erreur : Le total de la commande est introuvable !");
        return { error: 1, status: 400, data: "Total de la commande introuvable" };
    }

    console.log("💰 Total de la commande :", orderTotal);
    console.log("💳 Montant de la transaction :", Math.abs(transaction.amount));

    if (Math.abs(Number(transaction.amount)) < Number(orderTotal)) {
        console.error("❌ Erreur : Le montant de la transaction est insuffisant pour couvrir le montant de la commande !");
        return { error: 1, status: 400, data: "Le montant de la transaction est insuffisant pour la commande" };
    }
    
    console.log("✅ Le montant de la transaction est suffisant pour valider la commande.");
    

    // Vérification que la transaction concerne bien le compte de la boutique
    const shopAccount = bankaccounts.find(account => account.number === "FRSHOP4578901234567890-0000999");

    console.log("🛒 UUID de la transaction :", transaction.uuid);
    console.log("🛍️ Compte source de la transaction :", transaction.account);
    console.log("🏪 Compte de la boutique attendu :", shopAccount?._id);

    if (!shopAccount) {
        console.error("⚠️ Le compte de la boutique est introuvable !");
        return { error: 1, status: 404, data: "Le compte de la boutique est introuvable" };
    }

    // 🔴 Vérification que la transaction vient bien du compte client et non de la boutique
    if (String(transaction.account) === String(shopAccount._id)) {
        console.error("❌ Erreur : Le paiement ne peut pas provenir du compte de la boutique !");
        return { error: 1, status: 400, data: "Le paiement ne peut pas provenir du compte de la boutique" };
    }

    // 🔴 Vérification que la transaction est bien un débit et non un crédit
    if (transaction.amount > 0) {
        console.error("❌ Erreur : La transaction doit être un débit (montant négatif) !");
        return { error: 1, status: 400, data: "La transaction doit être un débit (montant négatif)" };
    }

    // Mise à jour du statut de la commande
    order.status = "finalized";
    console.log("✅ Commande finalisée avec succès pour l'utilisateur", userId);

    return { error: 0, status: 200, data: "Commande finalisée avec succès" };
}




export default {
    shopLogin, getAllViruses, getAccountAmount, getTransactions, getOrder, getAccount, createWithdraw, createPayment, finalizeUserOrder
}