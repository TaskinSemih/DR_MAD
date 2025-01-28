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
    ...mapActions(["createPayment", "createWithdraw", "addTransaction"]), // Ajout de addTransaction
    validateOperation() {
  if (this.amount > this.balance) {
    alert("Solde insuffisant pour valider l'opération.");
    return; // Bloque l'opération si le solde est insuffisant
  }

  const transactionData = {
    id_account: this.account,
    amount: this.amount,
    destination: this.isRecipientChecked ? this.recipient : null, // null pour les retraits
  };

  const operationType = this.isRecipientChecked ? "createPayment" : "createWithdraw";

  this[operationType](transactionData).then(() => {
    alert(this.isRecipientChecked ? "Virement validé" : "Retrait effectué");
    // this.addTransaction({
    //   amount: -this.amount, // Montant en négatif pour indiquer un débit
    //   account: this.account,
    //   date: new Date().toISOString(),
    //   destination: this.isRecipientChecked ? this.recipient : null, // null pour un retrait
    //   type: this.isRecipientChecked ? "virement" : "retrait",
    // });
  });
}
,

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
