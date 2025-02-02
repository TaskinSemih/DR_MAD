<template>
  <div class="payment-container">
    <h2 class="title"> Payer la commande</h2>

    <!-- Champ UUID de la commande -->
    <div class="input-group">
      <label for="order-id"> UUID commande :</label>
      <input type="text" id="order-id" v-model="orderInput" @input="validateFields" class="input-field" placeholder="Entrez l'UUID de la commande" />
      <p v-if="errors.orderInput" class="error-text">{{ errors.orderInput }}</p>
    </div>

    <hr />
    <p v-if="orderDate" class="order-date"> Date : <strong>{{ orderDate }}</strong></p>
    <hr />

    <!-- Champ UUID de la transaction -->
    <div class="input-group">
      <label for="transaction-id"> UUID transaction :</label>
      <input type="text" id="transaction-id" v-model="uuidTransaction" @input="validateFields" class="input-field" placeholder="Entrez l'UUID de la transaction" />
      <p v-if="errors.uuidTransaction" class="error-text">{{ errors.uuidTransaction }}</p>
    </div>

    <!-- Bouton de paiement stylisé -->
    <button @click="finalizeOrder" :disabled="!isFormValid" class="pay-button">💰 Payer</button>
  </div>
</template>

<script>
import { finalizeUserOrder } from "@/services/shop.service";
import { mapState } from "vuex";

export default {
  props: {
    orderId: String
  },
  data() {
    return {
      orderInput: this.orderId || '',
      uuidTransaction: '',
      errors: {
        orderInput: '',
        uuidTransaction: ''
      }
    };
  },
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,
      userId: state => state.shop.shopUser._id,
      orders: state => state.shop.shopUser.orders,
    }),
    orderDate() {
      const order = this.orders?.find(order => order.uuid === this.orderInput);
      return order ? order.date : null;
    },
    isFormValid() {
      return this.orderInput.trim() !== '' && this.uuidTransaction.trim() !== '';
    }
  },
  methods: {
    validateFields() {
      this.errors.orderInput = this.orderInput.trim() === '' ? "⚠ L'ID de la commande est requis." : '';
      this.errors.uuidTransaction = this.uuidTransaction.trim() === '' ? "⚠ L'UUID de la transaction est requis." : '';
    },
    async finalizeOrder() {
      this.validateFields();

      if (!this.isFormValid) {
        console.warn("Erreur : Tous les champs ne sont pas remplis.");
        return;
      }

      console.log("shop user", this.shopUser);
      console.log("UUID Transaction:", this.uuidTransaction);

      const response = await finalizeUserOrder(this.userId, this.orderInput, this.uuidTransaction);

      console.log(response);
      await this.$router.push('/shop/orders');
    }
  }
};
</script>

<style scoped>
/* Conteneur principal */
.payment-container {
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Titre */
.title {
  color: #007bff;
  font-size: 22px;
  margin-bottom: 15px;
}

/* Groupes de champs */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}

/* Libellés */
label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #333;
}

/* Champs de saisie */
.input-field {
  width: 100%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

/* Messages d'erreur */
.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

/* Bouton de paiement */
.pay-button {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

.pay-button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

.pay-button:hover:not(:disabled) {
  background-color: #218838;
}

/* Date de commande */
.order-date {
  font-size: 16px;
  color: #333;
}
</style>
