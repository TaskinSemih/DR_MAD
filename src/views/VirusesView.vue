<template>
  <div class="viruses-container">
    <h1 class="title">Catalogue des Virus</h1>

    <div class="filters">
      <h2 class="section-title">Filtres</h2>
      <div class="filter-group">
        <label>
          <input type="checkbox" v-model="filterPriceActive" />
          Filtrer par prix
        </label>

        <label>
          <input type="checkbox" v-model="filterNameActive" />
          Filtrer par nom
        </label>

        <label>
          <input type="checkbox" v-model="stockData" />
          Voir les virus en stock
        </label>
      </div>

      <div v-if="filterPriceActive" class="filter-field">
        <label for="filterprice">Prix inférieur à :</label>
        <input
          v-model="priceFilter"
          id="filterprice"
          type="number"
          min="0"
          step="500"
          placeholder="Prix maximum"
        />
      </div>

      <div v-if="filterNameActive" class="filter-field">
        <label for="filtername">Nom contenant :</label>
        <input
          v-model="nameFilter"
          id="filtername"
          type="text"
          placeholder="Nom du virus"
        />
      </div>
    </div>

    <div class="virus-list">
      <h2 class="section-title">Liste des Virus</h2>
      <CheckedList
        :data="filters"
        :fields="['name', 'price', 'stock']"
        :itemCheck="true"
        :item-amount="true"
        :checked="selectedViruses"
        :itemButton="{ show: true, text: 'Détails' }"
        :listButton="{ show: true, text: 'Voir sélection' }"
        @check-toggled="handleCheckChanged"
        @item-button-clicked="handleItemButtonClicked"
        @list-button-clicked="handleListButtonClicked"
        @amount-changed="handleAmountChanged"
        @reset-checks="resetCheckboxes"
      />
    </div>
  </div>
</template>

<script>
import CheckedList from "@/components/CheckedList.vue";
import { mapState } from "vuex";

export default {
  name: "VirusesView",
  components: { CheckedList },
  data: () => ({
    priceFilter: 0,
    nameFilter: "",
    stockData: false,
    filterPriceActive: false,
    filterNameActive: false,
    selectedViruses: [],
  }),
  computed: {
    ...mapState({
      viruses: (state) => state.shop.viruses,
    }),
    filters() {
      let filteredViruses = this.viruses;
      if (this.filterPriceActive) {
        filteredViruses = filteredViruses.filter((v) => v.price <= this.priceFilter);
      }
      if (this.filterNameActive) {
        filteredViruses = filteredViruses.filter((v) => v.name.includes(this.nameFilter));
      }
      if (this.stockData) {
        filteredViruses = filteredViruses.filter((v) => v.stock > 0);
      }
      return filteredViruses;
    },
  },
  methods: {
    handleCheckChanged(index, checkedIndexes) {
      this.$set(this.selectedViruses, index, checkedIndexes);
    },
    handleItemButtonClicked(index) {
      alert(
        `Prix : ${this.viruses[index].price}\nStock : ${this.viruses[index].stock}`
      );
    },
    handleListButtonClicked() {
      alert("Virus select");
    },
    handleAmountChanged(index, amount) {
      this.$set(this.selectedViruses, index, { amount });
    },
    resetCheckboxes() {
      this.selectedViruses = [];
    },
  },
};
</script>

<style scoped>
/* Container */
.viruses-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

/* Title */
.title {
  font-size: 2.5rem;
  color: #007bff;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Filters */
.filters {
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.filter-group {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  color: #555;
}

input[type="checkbox"],
input[type="number"],
input[type="text"] {
  margin-left: 0.5rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

/* Virus List */
.virus-list {
  margin-top: 1rem;
}
</style>
