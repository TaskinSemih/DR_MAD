<template>
  <div>
    <input type="text" v-model="orderId" placeholder="Enter order id">
    <button @click="payOrder">Payer</button>
    <!--    <input type="text" placeholder="Entrez l'id de la transaction">-->
    <!--    <button @click="verifyPayment">Vérifier</button>-->
  </div>
</template>

<script>

export default {
  name: 'ShopPay',
  // [Vue warn]: Computed property "orderId" was assigned to but it has no setter
  // je dois utiliser data au lieu de computed sinon rip
  data() {
    return {
      orderId: this.$route.params.orderId || '',
    }
  },
  computed: {
    orderIndex() {
      return this.$route.params.orderIndex;
    },
    orders() {
      return this.$store.state.shop.shopUser.orders;
    },
    transactions() {
      return this.$store.state.bank.accountNumber.transactions;
    },
    shopAccountNumber() {
      return this.$store.state.bank.accountNumber;
    },
  },
  methods: {
    payOrder() {
      console.log('je paye la commande');
      this.orders[this.orderIndex].status = 'finalized';
      alert('Commande payée ' + this.orderId);
      this.orderId = '';
    },
    verifyPayment() {
      const order = this.orders.find(order => order.id === this.orderId);

      if (!this.transactions) {
        alert('No transaction found with this uuid');
        return;
      }

      if (this.transactions.amount !== order.amount) {
        alert('The transaction amount does not match the order amount');
        return;
      }

      if (this.transactions.account !== this.shopAccountNumber) {
        alert('The recipient is not the shop account number');
        return;
      }

      alert('Payment verification successful');
    },
  }
}
</script>

<style scoped>
</style>