<template>
  <div class="bank-account-container">
    <h1 class="title">Compte en Banque</h1>

    <form @submit.prevent="getAccountCredentials(number)" class="form">
      <div class="form-group">
        <label for="account-number">Numéro de compte</label>
        <input
          id="account-number"
          v-model="number"
          type="text"
          placeholder="Entrez votre numéro de compte"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn" :disabled="!number || !isAccountNumberValid">
          Soumettre
        </button>
        <button type="button" class="btn btn-secondary" @click="reset">
          Déconnexion
        </button>
      </div>
    </form>

    <div v-if="accountNumberError === -1" class="error-message">
      <p>Numéro de compte invalide.</p>
    </div>

    <div v-if="account" class="account-info">
      <p>Bonjour {{ account }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BankAccount",
  data: () => ({
    number: "",
  }),
  computed: {
    ...mapState({
      accountNumberError: (state) => state.bank.accountNumberError,
      account: (state) => state.bank.accountNumber.number,
    }),
    isAccountNumberValid() {
      const regex = /^[A-Za-z0-9]{22}-[0-9]{7}$/;
      return regex.test(this.number);
    },
  },
  methods: {
    ...mapActions(["getAccount", "resetAccountNumber"]),
    reset() {
      this.number = "";

      this.$store.commit("updateAccountNumberError", 0);
      this.$store.dispatch("resetAccountNumber");
    },
    getAccountCredentials(number) {
      this.$store.dispatch("getAccount", number);
    },
  },
};
</script>

<style scoped>
.bank-account-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary {
  background-color: #e74c3ced;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary:hover {
  background-color: #c0392b;
}

.btn:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

/* Error message */
.error-message {
  color: #dc3545;
  margin-top: 1rem;
}

/* Account info */
.account-info {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #333;
}
</style>
