<template>
  <div>
    <h2>Payer la commande</h2>
    <div v-if="orderId">
      <label for="order-id">uuid commande : </label>
      <input type="text" id="order-id" v-model="orderInput"/>
    </div>
    <div v-else>
      <label for="order-id">ID de la commande:</label>
      <input type="text" id="order-id" v-model="orderInput" placeholder="Entrez l'ID de la commande"/>
    </div>


    <label for="order-id">uuid transaction : </label>
    <input type="text" id="order-id" v-model="uuidTransaction"/>
    <button @click="finalizeOrder" :disabled="!orderInput">Payer</button>
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
      uuidTransaction: null
    };
  },
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,  // Ajoute shopUser ici
      userId: state => state.shop.shopUser._id,
      orders: state => state.shop.shopUser.orders,
    }),
    orderDate() {
      const order = this.orders && Array.isArray(this.orders) && this.orders.find(order => order.uuid === this.orderInput);
      return order ? order.date : null;
    },
    orderPrice() {
      const order = this.orders && Array.isArray(this.orders) && this.orders.find(order => order.uuid === this.orderInput);
      return order ? order.total : null;
    }
  },
  methods: {
    async finalizeOrder() {
      console.log("shop user", this.shopUser)
      const userId = this.userId;
      const orderId = this.orderInput;
      const transactionUuid = this.uuidTransaction
      console.log(transactionUuid);

      const response = await finalizeUserOrder(userId, orderId, transactionUuid);

      console.log(response);
      await this.$router.push('/shop/orders');
    },
  },
};
</script>

<style scoped>
</style>
