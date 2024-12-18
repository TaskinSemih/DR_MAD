<template>
  <div>
    <h1>Compte en banque</h1>

    <div>
      <label>Numéro de compte</label>
      <input v-model="number">
      <button @click="getAccountCredentials(number)" :disabled="!number || !isAccountNumberValid">
        Soumettre
      </button>
      <button @click="reset"> Réinitialiser</button>
    </div>
    <div v-if="accountNumberError === -1">
      <p>Account number is invalid</p>
    </div>
    <div v-if="account">
      <p> Bonjour {{ account }} </p>
      <!--      <p> test {{ accountAmount }}</p>-->
    </div>

    <!--    <div>-->
    <!--      <button @click="getAccountAmount(number)" :disabled="!number || !isAccountNumberValid">-->
    <!--        Submit-->
    <!--      </button>-->
    <!--      <button @click="getTransactions(number)" :disabled="!number || !isAccountNumberValid">-->
    <!--        See account transactions-->
    <!--      </button>-->
    <!--      <div v-if="accountNumberError === 1">-->
    <!--        <p>Account number valid</p>-->
    <!--        <p v-if="accountAmount">{{ accountAmount }}</p>-->

    <!--        <div v-if="accountTransactions.length > 0">-->
    <!--          <p>Transactions</p>-->
    <!--          <table>-->
    <!--            <thead>-->
    <!--            <tr>-->
    <!--              <th>Amount</th>-->
    <!--              <th>Date</th>-->
    <!--            </tr>-->
    <!--            </thead>-->
    <!--            <tbody>-->
    <!--            <tr v-for="(transaction, index) in accountTransactions"-->
    <!--                :key="index">-->
    <!--              <td>{{ transaction.amount }}</td>-->
    <!--              <td>{{ getFormattedDate(transaction.date.$date) }}</td>-->
    <!--            </tr>-->
    <!--            </tbody>-->
    <!--          </table>-->
    <!--        </div>-->

    <!--      </div>-->
    <!--      <div v-else-if="accountNumberError === -1">-->
    <!--        <p>Account number is invalid</p>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import moment from 'moment'

export default {
  name: 'BankAccount',
  data: () => ({
    number: '',
  }),
  computed: {
    ...mapState({
      accountNumberError: state => state.bank.accountNumberError,
      accountAmount: state => state.bank.accountAmount,
      accountTransactions: state => state.bank.accountTransactions,
      account: state => state.bank.accountNumber.number
    }),
    isAccountNumberValid() {
      const regex = /^[A-Za-z0-9]{22}-[0-9]{7}$/;
      return regex.test(this.number)
    },
  },
  methods: {
    ...mapActions(['getAccountAmount', 'getTransactions', 'getAccount', 'resetAccountNumber']),
    getFormattedDate(date) {
      return moment(date).format('MM/DD/YYYY') + " at " + moment(date).format('HH:mm:ss')
    },
    reset() {
      this.number = ''
      this.$store.commit('updateAccountNumberError', 0)
      this.$store.dispatch('resetAccountNumber')
    },
    test() {
      console.log("salut")
    },
    getAccountCredentials(number) {
      this.$store.dispatch('getAccount', number)
      console.log("je suis le account de getAccountcredentials " + this.account)
      this.$store.dispatch('getAccountAmount', number).then(() => {
        console.log("je suis le accountAmount de getAccountcredentials " + this.accountAmount)
        this.$router.push({name: 'bankamount'})
        // , params: {balance: this.accountAmount}}
      })
    }
  }
}
</script>

<style scoped>

h1 {
  color: #00ff00;
  font-size: 24px;
}

label {
  display: block;
  margin-top: 10px;
  color: #00ff00;
}

input {
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin: 5px 0;
  border-radius: 3px;
}

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

p {
  color: #00ff00;
  margin-top: 10px;
}

span {
  color: #00ff00;
}

li {
  color: #00ff00;
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
</style>