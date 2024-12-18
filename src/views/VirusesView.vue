<template>
  <div>
    <h1>Viruses</h1>
    <p>Store's array : {{ viruses }}</p>
    <p>List format</p>
    <hr>
    <div>
      <span>Filters :</span><label for="filterpriceactive">Per price</label><input type="checkbox"
                                                                                   v-model="filterPriceActive"
                                                                                   id="filterpriceactive">

      <span>Filters :</span><label for="filterNameActive">Per name</label><input type="checkbox"
                                                                                 v-model="filterNameActive"
                                                                                 id="filterNameActive">
      <span>
        <label for="filterstock">See viruses that are in stock ?</label>
        <input id="filterstock" type="checkbox" v-model="stockData">
      </span>
    </div>
    <div>
      <div v-if="filterPriceActive">
        <label for="filterprice">Price less than :</label>
        <input v-model="priceFilter" id="filterprice" type="number" @keypress="allowNumbersOnly" min="0" step="500">
      </div>
      <div v-if="filterNameActive">
        <label for="filtername">Name containing :</label>
        <input v-model="nameFilter" id="filtername" type="text">
      </div>

      <CheckedList
          :data="filters"
          :fields="['name', 'price', 'stock']"
          :itemCheck="true"
          :item-amount="true"
          :checked="selectedViruses"
          :itemButton="{ show: true, text: 'Item details' }"
          :listButton="{ show: true, text: 'See selected viruses' }"
          @check-toggled="handleCheckChanged"
          @item-button-clicked="handleItemButtonClicked"
          @list-button-clicked="handleListButtonClicked"
          @amount-changed="handleAmountChanged"
          @reset-checks="resetCheckboxes"
      >
      </CheckedList>
    </div>
  </div>
</template>


<script>
import * as events from "events";
import CheckedList from "@/components/CheckedList.vue";
import {mapState} from "vuex";

export default {
  name: 'VirusesView',
  components: {CheckedList},
  data: () => ({
    priceFilter: 0,
    nameFilter: '',
    stockData: false,
    filterPriceActive: false,
    filterNameActive: false,
    selectedViruses: []
  }),
  computed: {
    events() {
      return events
    },
    ...mapState({
      viruses: state => state.shop.viruses
    }),
    filterVirusesByPrice() {
      if (this.priceFilter > 0) return this.viruses.filter(v => v.price <= this.priceFilter)
      return this.viruses
    },
    filterVirusesByName() {
      if (this.nameFilter) return this.viruses.filter(v => v.name.includes(this.nameFilter))
      return this.viruses
    },
    filterVirusesByStock() {
      if (this.stockData) return this.viruses.filter(v => v.stock > 0)
      return this.viruses
    },
    filters() {
      let filteredViruses = this.viruses;
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
    }
  },
  created() {
    console.log(this.$store.state)
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
      for (let i = 0; i < this.selectedViruses.length; i++) {
        this.$set(this.selectedViruses, i, false)
      }
    },
    handleCheckChanged(index, checkedIndexes) {
      console.log("VirusesView says: checkedIndexes = " + checkedIndexes)
      this.$set(this.selectedViruses, index, checkedIndexes)
    },
    handleItemButtonClicked(index) {
      console.log("VirusesView says: item button clicked on index " + index)
      alert("Price of " + this.viruses[index].name + " is " + this.viruses[index].price + "₿" + "\n" + "Sold T/F : " + this.viruses[index].sold + "\nStock: " + this.viruses[index].stock)
    },
    handleListButtonClicked() {
      let result = "List of checked viruses: \n\n";
      console.log(this.selectedViruses)
      for (let [index, checked] of Object.entries(this.selectedViruses)) {
        if (checked) {
          result += `Name: ${this.viruses[index].name}\n Amount : ${this.selectedViruses[index].amount} \n\n`
        }
      }
      alert(result);
      this.resetCheckboxes();
    },
    handleAmountChanged(index, amount) {
      console.log("VirusesView says: amount changed on index " + index + " to " + amount)
      console.log(this.viruses[index].name + " " + amount)
      this.$set(this.selectedViruses, index, {amount: amount})
    }
  }
}
</script>
<style scoped>

/* ./src/index.css */
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
