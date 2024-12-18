<template>
  <div class="container">
    <VerticalMenu class="fixed-navbar" :items="menuItems">
      <template v-slot:menu-link="{ label }">
        <span>{{ label }}</span>
      </template>
    </VerticalMenu>

    <div>
      <BankHome/>
      <BankAmount v-if="$route.path === '/bank/amount' && balance !== undefined" :balance="balance">
        <template v-slot:account-amount>
          <input type="text" :value="`${balance} €`" :style="{ color: balance < 0 ? 'red' : 'green' }" readonly/>
        </template>
      </BankAmount>
      <router-view/>
    </div>
  </div>
</template>

<script>
// import NavBar from '../components/NavBar.vue';
import VerticalMenu from '../components/VerticalMenu.vue';
import BankAmount from '../views/BankAmount.vue';
import BankHome from "@/views/BankHome.vue";
import {mapState} from "vuex";

export default {
  name: 'BankView',
  components: {
    BankHome,
    // NavBar,
    VerticalMenu,
    BankAmount
  },
  computed: {
    ...mapState({
      balance: state => state.bank.accountNumber.amount,
      account: state => state.bank.accountNumber,
    }),
    navLinks() {
      // console.log('je suis connecte');
      // console.log(this.shopUser.login);
      return [
        {label: 'Mon compte', to: '/bank/account'},
      ]
    },

  },
  data() {
    return {
      menuItems: [
        {type: 'button', label: 'Mon compte', to: '/bank/account'},
        // {type: 'title', label: 'Opérations', to: '/bank/operation'},
        {type: 'button', label: 'Solde', to: '/bank/amount'},
        {type: 'button', label: 'Débit/Virement', to: '/bank/operation'},
        // {type: 'title', label: 'États'},
        {type: 'button', label: 'Historique', to: '/bank/history'}
      ]
    }
  },
  // created() {
  //   this.$store.dispatch('getAccountAmount').then(res => {
  //     this.accountAmount = res;
  //   })
  // }
}
</script>

<style scoped>
.vertical-menu {
  width: 200px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 20px;
}

.vertical-menu div {
  margin-bottom: 10px;
}

.vertical-menu button {
  background-color: #000;
  color: #0F0;
  border: none;
  padding: 5px 10px;
  text-align: left;
  text-decoration: none;
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin: 4px 0;
  cursor: pointer;
  transition-duration: 0.4s;
}

.vertical-menu button:hover {
  background-color: #007700;
  color: #0F0;
}

.container {
  display: flex;
}

.fixed-navbar {
  width: 200px;
}
</style>