<template>
  <div>
    <h1>Viruses</h1>
    <!--        <p> {{ items }}</p>-->
    <hr>
    <div>
      <span>Filtres :</span><label for="filterpriceactive">Par prix</label><input type="checkbox"
                                                                                  v-model="filterPriceActive"
                                                                                  id="filterpriceactive">

      <span>Filtres :</span><label for="filterNameActive">Par nom</label><input type="checkbox"
                                                                                v-model="filterNameActive"
                                                                                id="filterNameActive">
      <span>
        <label for="filterstock">Voir les virus en stock ?</label>
        <input id="filterstock" type="checkbox" v-model="stockData">
      </span>
    </div>
    <div>
      <div v-if="filterPriceActive">
        <label for="filterprice">Prix moins que :</label>
        <input v-model="priceFilter" id="filterprice" type="number" @keypress="allowNumbersOnly" min="0" step="500">
      </div>
      <div v-if="filterNameActive">
        <label for="filtername">Contenant les lettres :</label>
        <input v-model="nameFilter" id="filtername" type="text">
      </div>

      <CheckedList
          :data="filters"
          :fields="['name', 'price','promotion']"
          :itemCheck="true"
          :checked="selectedItems"
          :itemButton="{show: true, text: 'Ajouter au panier'}"
          :listButton="{show: true, text: 'Tout ajouter au panier'}"
          :cancel-button="{show: false}"
          :itemAmount="true"
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
import {mapState} from 'vuex';
import CheckedList from './CheckedList.vue';

export default {
  name: 'ItemsList',
  components: {
    CheckedList,
  },
  data() {
    return {
      selectedItems: [],
      priceFilter: 0,
      nameFilter: '',
      stockData: false,
      filterPriceActive: false,
      filterNameActive: false,
    };
  },
  computed: {
    ...mapState({
      items: state => state.shop.viruses,
    }),
    filterVirusesByPrice() {
      if (this.priceFilter > 0) return this.items.filter(v => v.price <= this.priceFilter)
      return this.items
    },
    filterVirusesByName() {
      if (this.nameFilter) return this.items.filter(v => v.name.includes(this.nameFilter))
      return this.items
    },
    filterVirusesByStock() {
      if (this.stockData) return this.items.filter(v => v.stock > 0)
      return this.items
    },
    filters() {
      let filteredViruses = this.items;
      if (this.filterPriceActive) {
        filteredViruses = filteredViruses.filter(v => v.price <= this.priceFilter);
      }
      if (this.filterNameActive) {
        filteredViruses = filteredViruses.filter(v => v.name.includes(this.nameFilter));
      }
      if (this.stockData) {
        filteredViruses = filteredViruses.filter(v => v.stock > 0);
      }
      return filteredViruses;
    },
    // discounts() {
    //   return this.data.map(item => item.promotion.map(promo => promo.discount + '%').join(' | '));
    // },
  },
  methods: {
    allowNumbersOnly(event) {
      if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 8) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    },
    resetCheckboxes() {
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i] && typeof this.selectedItems[i] === 'object') {
          this.$set(this.selectedItems[i], 'amount', 0);
        }
        this.$set(this.selectedItems, i, false)
      }
    },
    handleCheckChanged(index, checkedIndexes) {
      console.log("VirusesView says: checkedIndexes = " + checkedIndexes)
      this.$set(this.selectedItems, index, checkedIndexes)
    },
    handleItemButtonClicked(index) {
      // console.log("VirusesView says: item button clicked on index " + index)
      // alert("Price of " + this.filters[index].name + " is " + this.filters[index].price + "₿" + "\n" + "Sold T/F : " + this.filters[index].sold + "\nStock: " + this.filters[index].stock)
      console.log("j'ajoute dans le panier");
      const item = this.filters[index];
      const amount = parseInt(this.selectedItems[index].amount, 10);
      this.$store.dispatch('addToBasket', {item: item, amount: amount});
    },
    handleListButtonClicked() {
      let result = "List of checked viruses: \n\n";
      for (let [index, checked] of Object.entries(this.selectedItems)) {
        if (checked) {
          console.log("VirusesView says: list button clicked on index " + index)
          console.log(this.selectedItems);
          result += `Name: ${this.filters[index].name}\n Amount : ${this.selectedItems[index].amount} \n\n`

          const item = this.filters[index];
          const amount = parseInt(this.selectedItems[index].amount, 10);
          this.$store.dispatch('addToBasket', {item: item, amount: amount});
        }
      }
      alert(result);
      this.resetCheckboxes();
    },
    handleAmountChanged(index, amount) {
      console.log("VirusesView says: amount changed on index " + index + " to " + amount)
      console.log(this.items[index].name + " " + amount)
      this.$set(this.selectedItems, index, {amount: amount})
    },
  },
};
</script>
<style scoped>
/* Boutons */
button {
  background-color: #007bff; /* Bleu principal */
  color: #fff; /* Texte blanc */
  border: 1px solid #007bff;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; /* Bleu plus foncé */
}

/* Checkbox */
input[type="checkbox"] {
  transform: scale(1.2);
  margin-right: 10px;
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #fff;
  border: 2px solid #007bff;
  border-radius: 3px;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #007bff;
  border: 2px solid #007bff;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Inputs (text & number) */
input[type="text"],
input[type="number"] {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 16px;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Table */
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  color: #333;
}

th {
  background-color: #007bff;
  color: #fff;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #e9ecef;
  transition: background-color 0.3s ease;
}

/* Texte */
h1 {
  color: #007bff;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

p,
label,
span {
  color: #555;
}

/* Séparateur */
hr {
  border: 0;
  border-top: 1px solid #ddd;
  margin: 20px 0;
}

/* Conteneur principal */
body {
  background-color: #f8f9fa;
  color: #333;
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
}
</style>
