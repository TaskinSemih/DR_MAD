<template>
  <div class="shop-buy">
    <!-- Liste des articles -->
    <div class="shop-buy__items-container">
      <h2 class="section-title">Nos Articles</h2>
      <ItemsList class="shop-buy__items" />
    </div>

    <!-- Panier -->
    <div class="shop-buy__basket-container">
      <h2 class="section-title">Votre Panier</h2>
      <BasketList class="shop-buy__basket" />
    </div>
  </div>
</template>

<script setup>
import ItemsList from "@/components/ItemsList.vue";
import BasketList from "@/components/BasketList.vue";
</script>

<style scoped>
/* Global Container */
.shop-buy {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 1200px;
}

/* Section Containers */
.shop-buy__items-container,
.shop-buy__basket-container {
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Titles */
.section-title {
  font-size: 1.8rem;
  color: #007bff;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

/* Items List & Basket */
.shop-buy__items,
.shop-buy__basket {
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
}
</style>
