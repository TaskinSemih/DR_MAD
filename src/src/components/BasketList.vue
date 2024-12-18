<template>
  <checked-list
      :data="currentBasket.items"
      :fields="['item.name', 'amount', 'Price']"
      :item-button="{show: true, text: 'Supprimer'}"
      :list-button="{show: true, text: 'Acheter'}"
      :cancel-button="{show: false}"
      @item-button-clicked="deleteItemFromBasket"
      @list-button-clicked="basketToOrder"
  />
</template>

<script>
import {mapGetters} from 'vuex';
import CheckedList from './CheckedList.vue';

export default {
  name: 'BasketList',
  components: {
    CheckedList,
  },
  computed: {
    ...mapGetters(['currentBasket']),
    shopUser() {
      return this.$store.state.shop.shopUser
    },
    // Price() {
    //   return this.currentBasket.items.reduce((acc, item) => acc + item.item.price * item.amount, 0)
    // }
  },
  methods: {
    deleteItemFromBasket(index) {
      const item = this.currentBasket.items[index];
      this.$store.dispatch('removeItemFromBasket', item)
    },
    basketToOrder() {
      this.$store.dispatch('createOrder').then((order) => {
        alert('uuid: ' + order.uuid);
        this.$store.dispatch('clearBasket')
      })
    }
  }
}
</script>

<style>

</style>