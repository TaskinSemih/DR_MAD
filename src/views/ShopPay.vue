<template>
  <div class="pay-container">
    <h1 class="title">Paiement de la Commande</h1>

    <form @submit.prevent="payOrder" class="form">
      <!-- Input pour l'ID de commande -->
      <div class="form-group">
        <label for="orderId">ID de la commande</label>
        <input
          id="orderId"
          v-model="orderId"
          type="text"
          placeholder="Entrez l'ID de la commande"
        />
      </div>

      <!-- Bouton Payer -->
      <button type="submit" class="btn">Payer</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ShopPay",
  data() {
    return {
      orderId: this.$route.params.orderId || "",
    };
  },
  computed: {
    orderIndex() {
      return this.$route.params.orderIndex;
    },
    orders() {
      return this.$store.state.shop.shopUser.orders;
    },
  },
  methods: {
    payOrder() {
      console.log("je paye la commande");
      this.orders[this.orderIndex].status = "finalized";
      alert("Commande payée " + this.orderId);
      this.orderId = "";
    },
  },
};
</script>

<style scoped>
/* Container */
.pay-container {
  max-width: 500px;
  margin: 5% auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Title */
.title {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1.5rem;
}

/* Form */
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
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

/* Button */
.btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
