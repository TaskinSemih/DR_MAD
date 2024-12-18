<template>
  <div>
    Orders

    <CheckedList
        :data="orders"
        :fields="['amount', 'status', 'uuid']"
        :itemCheck="false"
        :checked="[]"
        :itemButton="{show: isStatus, text: 'Acheter'}"
        :cancelButton="({show: isStatus, text: 'Annuler'})"
        :list-button="{show: false}"
        :itemAmount="false"
        :buy-button="{show: false}"
        @item-button-clicked="itemButtonBuy"
        @item-cancel-button-clicked="itemButtonCancel"
    />
  </div>
</template>

<script>

import CheckedList from "@/components/CheckedList.vue";

export default {
  name: 'ShopOrders',
  components: {
    CheckedList,
  },
  data: () => {
    return {}
  },
  computed: {
    orders() {
      return this.$store.state.shop.shopUser.orders
    }
  },
  methods: {
    test() {
      console.log('test');
    },
    isStatus(index) {
      return this.orders[index].status === 'waiting_payment';
    },
    itemButtonBuy(index) {
      console.log('JE FINALISE LA COMMANDE');
      // this.orders[index].status = 'finalized';
      let uuid = this.orders[index].uuid;
      this.$router.push({name: 'shoppay', params: {orderId: uuid, orderIndex: index}});
    },
    itemButtonCancel(index) {
      console.log('JE CANCEL LA COMMANDE');
      this.orders[index].status = 'cancelled';
      this.$store.dispatch('cancelOrder', this.orders[index]);
    },
  }
}
</script>

<style>

</style>