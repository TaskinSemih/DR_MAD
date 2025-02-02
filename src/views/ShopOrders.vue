<template>
  <div class="orders-container">
    <h1 class="title">Vos Commandes</h1>

    <div class="orders-list">
      <CheckedList
        :data="orders"
        :fields="['amount', 'status', 'uuid', 'date']"
        :itemCheck="false"
        :checked="[]"
        :itemButton="{ show: isStatus, text: 'Acheter' }"
        :cancelButton="{ show: isStatus, text: 'Annuler' }"
        :list-button="{ show: false }"
        :itemAmount="false"
        :buy-button="{ show: false }"
        @item-button-clicked="itemButtonBuy"
        @item-cancel-button-clicked="itemButtonCancel"
      />
    </div>
  </div>
</template>

<script>
import CheckedList from "@/components/CheckedList.vue";

export default {
  name: "ShopOrders",
  components: {
    CheckedList,
  },
  computed: {
    orders() {
      return this.$store.state.shop.shopUser.orders;
    },
  },
  methods: {
    isStatus(index) {
      return this.orders[index].status === "waiting_payment";
    },
    itemButtonBuy(index) {
      let uuid = this.orders[index].uuid;
      this.$router.push({
        name: "shoppay",
        params: { orderId: uuid, orderIndex: index },
      });
    },
    itemButtonCancel(index) {
      this.orders[index].status = "cancelled";
      this.$store.dispatch("cancelOrder", this.orders[index]);
    },
  },
};
</script>

<style scoped>
/* Global Container */
.orders-container {
  max-width: 900px;
  margin: 3rem auto;
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

/* Orders List */
.orders-list {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
