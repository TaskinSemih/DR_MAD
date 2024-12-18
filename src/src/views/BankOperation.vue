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
    <p v-if="operationMessage">{{ operationMessage }}</p>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex";


export default {
  data() {
    return {
      amount: null,
      isRecipientChecked: false,
      recipient: "",
      operationMessage: ""
    };
  },
  computed: {
    ...mapState({
      account: state => state.bank.accountNumber._id
    })
  },
  methods: {
    ...mapActions(["createPayment", 'createWithdraw']),
    validateOperation() {
      console.log("validateOperation");
      console.log(this.account);
      console.log(this.amount);
      console.log(this.recipient);
      if (this.isRecipientChecked) {
        this.createPayment({
          id_account: this.account,
          amount: this.amount,
          destination: this.recipient,
        }).then(() => {
          this.operationMessage = "Opération validée";
        })
      } else {
        this.createWithdraw({
          id_account: this.account,
          amount: this.amount,
        }).then(() => {
          this.operationMessage = "Retrait effectué";
        })
      }
    },
    test() {
      // @change dans le input
      console.log("test");
      console.log(this.account);
      console.log(this.amount);
      console.log(this.recipient);
    }
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
