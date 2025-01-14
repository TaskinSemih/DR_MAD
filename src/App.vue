<template>
  <div id="app">
    <NavBar :links="links">
      <template v-slot:nav-button="{ label }">
        <span v-if="label === 'Boutique'"><strong>{{ label }}</strong></span>
        <img v-else-if="label === 'Compte bancaire'" src="@/assets/bank-icon.jpg" alt="Bank" style="width: 30px">
        <!-- Logout sans aucun style CSS -->
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
      console.log('logoutUser method called'); // Vérifie si la méthode est appelée
      if (!this.logout) {
        console.error('logout is not defined in Vuex actions');
        return;
      }
      this.logout(); // Appelle l’action logout de Vuex
      this.$router.push('/shop/login'); // Redirige vers la page de login
    },


    isEmpty(obj) {
      return obj === null || Object.keys(obj).length === 0; // Vérifie null ou objet vide
    },
  },
  mounted() {
    this.getAllViruses(); // Charge les données nécessaires
  }
};
</script>

<style>
#app {
}
</style>
