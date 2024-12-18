<template>
  <div>
    <NavBar class="fixed-navbar" :links="navLinks">
      <template v-slot:nav-button="{ label }">
        <span>{{ label }}</span>
      </template>
    </NavBar>
    <h1>Boutique</h1>
    <ShopHome/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ShopHome from "@/views/ShopHome.vue";

export default {
  name: 'ShopView',
  components: {
    ShopHome,
    NavBar
  },
  computed: {
    shopUser() {
      return this.$store.state.shop.shopUser
    },
    navLinks() {
      if (Object.keys(this.shopUser).length > 0) {
        console.log('je suis connecte');
        console.log(this.shopUser.login);
        return [
          {label: 'Faire des emplettes', to: '/shop/buy'},
          {label: 'Payer', to: '/shop/pay'},
          {label: 'Commandes', to: '/shop/orders'},
        ]
      } else {
        return []
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.$emit('updateNavLinks', vm.navLinks);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$root.$emit('updateNavLinks', []);
    next();
  }
}
</script>

<style scoped>
.fixed-navbar {
  top: 0;
  width: 100%;
  z-index: 1000;
}
</style>