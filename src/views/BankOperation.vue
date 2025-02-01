<template>
  <div class="container">
    <h1>
      <slot name="title">Débit / Virement</slot>
    </h1>
    <div class="form-group">
      <input type="number" min="1" v-model="amount" placeholder="Montant" @change="test">
    </div>
    <div class="form-group checkbox-group">
      <input type="checkbox" id="checkbox" v-model="isRecipientChecked">
      <label for="checkbox">Destinataire</label>
      <input type="text" v-if="isRecipientChecked" v-model="recipient" placeholder="Destinataire">
    </div>
    <button @click="validateOperation">Valider</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      amount: null,
      isRecipientChecked: false,
      recipient: "",
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.bank.accountNumber._id,
      balance: (state) => state.bank.accountNumber.amount, // Ajout du solde du compte
      
    }),
    
  },
  methods: {
    ...mapActions(["createPayment", "createWithdraw"]), 
    validateOperation() {
      console.log("Contenu Vuex Bank :", this.$store.state.bank);
      console.log("Account récupéré :", this.account);
    if (!this.account) {
        alert("Veuillez sélectionner un compte avant d'effectuer une opération.");
        return;
    }

    if (this.amount > this.balance) {
        alert("Solde insuffisant pour valider l'opération.");
        return;
    }

    console.log("Compte source :", this.account);
    console.log("Montant :", this.amount);
    console.log("Destinataire :", this.recipient);
    console.log("isRecipientChecked :", this.isRecipientChecked);

    const transactionData = {
        id_account: this.account,
        amount: this.amount,
        destination: this.isRecipientChecked ? this.recipient : null,
    };

    console.log("Données envoyées :", transactionData);

    const operationType = this.isRecipientChecked ? "createPayment" : "createWithdraw";

    this[operationType](transactionData).then(() => {
        alert(this.isRecipientChecked ? "Virement validé" : "Retrait effectué");
    }).catch(err => console.error("Erreur lors de l'opération :", err));
},


    test() {
      console.log(this.account);
      console.log(this.amount);
      console.log(this.recipient);
    },
  }

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.form-group {
  margin-bottom: 10px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-left: 5px;
}

button {
  margin-top: 10px;
}
</style>
