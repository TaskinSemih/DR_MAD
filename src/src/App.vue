<template>
  <div id="app">
    <NavBar :links="links">
      <template v-slot:nav-button="{ label }">
        <span v-if="label === 'Boutique'"><strong>{{ label }}</strong></span>
        <img v-else-if="label === 'Compte bancaire'" src="@/assets/bank-icon.jpg" alt="Bank" style="width: 20px">
      </template>
    </NavBar>
    <button v-if="!isEmpty(shopUser)" @click="logoutUser">Logout</button>
    <router-view/>
    <div style="color: aliceblue">
      <p v-if="shopUser"> {{ shopUser.login }}</p>
      <p v-else> Log or get out</p>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: {NavBar},
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,
    }),
    links() {
      if (!this.isEmpty(this.shopUser)) {
        return [
          {label: 'Boutique', to: '/shop'},
          {label: 'Compte bancaire', to: '/bank'},
        ]
      } else {
        return [
          {label: 'Boutique', to: '/shop'},
          {label: 'Compte bancaire', to: '/bank'},
          {label: 'Login', to: '/shop/login'}
        ]
      }
    }
  },
  methods: {
    ...mapActions(['getAllViruses', 'logout']),
    logoutUser() {
      this.logout();
      this.$router.push('/shop/login');
    },
    isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
  },
  mounted() {
    this.getAllViruses()
  }
};
</script>
<style>
#app {
}
</style>