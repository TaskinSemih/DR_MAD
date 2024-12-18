<template>
  <div class="shop-buy">
    <ItemsList class="shop-buy__items"/>
    <BasketList class="shop-buy__basket"/>
  </div>
</template>

<script setup>
import ItemsList from '@/components/ItemsList.vue'
import BasketList from '@/components/BasketList.vue'
</script>

<style scoped>
.shop-buy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100%;
}

.shop-buy__items {
  width: 100%;
  max-width: 100%;
  align-self: flex-start;
}

.shop-buy__basket {
  width: 100%;
  max-width: 30%;
  align-self: flex-start;
}
</style>