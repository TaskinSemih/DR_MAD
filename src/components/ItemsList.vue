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

button {
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin: 5px 0;
  border-radius: 3px;
}

button:hover {
  background-color: #007f00;
}

input[type="checkbox"] {
  transform: scale(1.2);
  margin-right: 10px;
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #000;
  border: 2px solid #00ff00;
  border-radius: 3px;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #00ff00;
  border: 2px solid #00ff00;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.7);
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #00ff00;
  padding: 8px;
  text-align: left;
  color: #00ff00;
}

th {
  background-color: #00ff00;
  color: #000;
}

tr:nth-child(even) {
  background-color: #111;
}

span {
  color: #00ff00;
}

body {
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  padding: 20px;
}

h1 {
  color: #00ff00;
  font-size: 24px;
}

p {
  margin: 10px 0;
  color: #00ff00;
}

hr {
  border: 0;
  border-top: 1px solid #00ff00;
}

label {
  color: #00ff00;
}


input[type="checkbox"] {
  transform: scale(1.2);
  margin-right: 10px;
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #000;
  border: 2px solid #00ff00;
  border-radius: 3px;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #00ff00;
  border: 2px solid #00ff00;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.7);
}


input[type="text"] {
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin: 5px 0;
  border-radius: 3px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type="number"] {
  background-color: #000;
  color: #00ff00;
  font-size: 16px;
  padding: 5px;
  border: 2px solid #00ff00;
  border-radius: 3px;
  width: 100px;
  height: 30px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  background-color: #000;
  color: #00ff00;
  font-size: 12px;
  width: 20px;
  height: 30px;
  border: 2px solid #00ff00;
  border-radius: 3px;
  cursor: pointer;
}

input[type="number"]::-webkit-outer-spin-button:hover,
input[type="number"]::-webkit-inner-spin-button:hover {
  background-color: #00ff00;
  border: 2px solid #00ff00;
  color: #000;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #00ff00;
  padding: 8px;
  text-align: left;
  color: #00ff00;
}

th {
  background-color: #00ff00;
  color: #000;
}

tr:nth-child(even) {
  background-color: #111;
}

span {
  color: #00ff00;
}
</style>