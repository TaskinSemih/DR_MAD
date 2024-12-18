<template>
  <div>
    <slot name="title">
      <h1>Opérations passées</h1>
    </slot>

    <input type="checkbox" v-model="filterByPeriod" id="filter"/>
    <label for="filter">Filtrer par période </label>

    <input type="date" v-if="filterByPeriod" v-model="startDate" id="start-date"/>
    <label for="start-date" v-if="filterByPeriod">Du</label>

    <input type="date" v-if="filterByPeriod" v-model="endDate" id="end-date"/>
    <label for="end-date" v-if="filterByPeriod"></label>

    <data-table
        :headers="headers"
        :items="filteredTransactions"
        item-key="_id"
        show-select
        class="elevation-1"
    >

      <template v-slot:items="props">
        <td>{{ props.item.amount }}</td>
        <td>{{ formatDate(props.item.date.$date) }}</td>
        <td>{{ props.item.account }}</td>
        <td>
          <input type="checkbox" v-model="props.item.selected">
          <button @click="openDialog(props.item)">Voir</button>
        </td>
      </template>
    </data-table>

    <button @click="openDialogForSelected">Voir</button>

    <dialog :open="dialog" @close="dialog = false">
      <div>
        <h2>UUID de la transaction</h2>
        <p>{{ dialogText }}</p>
      </div>
    </dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import DataTable from "@/components/DataTable.vue";

export default {
  components: {DataTable},
  data() {
    return {
      filterByPeriod: false,
      startDate: null,
      endDate: null,
      dialog: false,
      dialogText: '',
      headers: [
        {label: 'Montant', value: 'amount'},
        {label: 'Date', value: 'date'},
        {label: 'Destination', value: 'type'},
        {label: 'Action', value: 'action', sortable: false},
      ],
    };
  },
  watch: {
    filterByPeriod(newVal) {
      if (!newVal) {
        this.startDate = null;
        this.endDate = null;
      }
    },
    startDate(newStartDate, oldStartDate) {
      if (this.endDate && new Date(newStartDate) > new Date(this.endDate)) this.startDate = oldStartDate;
    },
    endDate(newEndDate, oldEndDate) {
      if (this.startDate && new Date(newEndDate) < new Date(this.startDate)) this.endDate = oldEndDate;
    },
  },
  computed: {
    ...mapState({
      transactions: (state) => state.bank.accountNumber.transactions,
    }),
    filteredTransactions() {
      console.log("JE SUIS DANS LE COMPUTED");
      console.log(this.transactions);
      return this.transactions.filter((transaction) => {
        console.log("JE SUIS DANS LE FILTER");
        console.log(transaction);
        console.log("JE SUIS MORT");
        const transactionDate = new Date(transaction.date.$date);
        const startDate = this.startDate ? new Date(this.startDate) : null;
        const endDate = this.endDate ? new Date(this.endDate) : null;

        if (startDate && transactionDate < startDate) return false;
        return !(endDate && transactionDate > endDate);
      });
    },
  },
  methods: {
    openDialog(transaction) {
      console.log(this.filteredTransactions);
      this.dialogText = transaction.uuid;
      this.dialog = true;
    },
    openDialogForSelected() {
      console.log("test");
      const selectedTransactions = this.filteredTransactions.filter(t => t.selected);
      this.dialogText = selectedTransactions.map(t => `- ${t.uuid}`).join('\n\n');
      this.dialog = true;
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
  },
};
</script>
<style scoped>
input[type="date"] {
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin: 5px 0;
  border-radius: 3px;
}

label {
  color: #00ff00;
}
</style>