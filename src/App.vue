<template>
  <div id="app">
    <NavBar :links="links">
      <template v-slot:nav-button="{ label }">
        <span v-if="label === 'Boutique'"><strong>{{ label }}</strong></span>
        <img v-else-if="label === 'Compte bancaire'" src="@/assets/bank-icon.jpg" alt="Bank" style="width: 30px">
        <span v-else-if="label === 'Logout'" @click="logoutUser">{{ label }}</span>
      </template>
    </NavBar>

    <router-view/>
  </div>
</template>


<script>
import { mapActions, mapState } from 'vuex';
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: { NavBar },
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,
    }),
    links() {
      if (this.isEmpty(this.shopUser)) {
        return [
          { label: 'Compte bancaire', to: '/bank' },
          { label: 'Login', to: '/shop/login' }
        ];
      } else {
        return [
          { label: 'Boutique', to: '/shop' },
          { label: 'Compte bancaire', to: '/bank' },
          { label: 'Logout',  to: this.$route.path } //mettre la route de où est l'utilisateur
        ];
      }
    }
  },
  methods: {
    ...mapActions(['getAllViruses', 'logout']),
    logoutUser() {
      console.log('logoutUser())');
      if (!this.logout) {
        console.error('logout isnt defined');
        return;
      }
      this.logout();
      this.$router.push('/shop/login');
    },


    isEmpty(obj) {
      return obj === null || Object.keys(obj).length === 0;
    },
  },
  mounted() {
    this.getAllViruses();
  }
};
</script>

<style>
#app {
}
</style>
