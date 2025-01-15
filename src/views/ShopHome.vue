<template>
  <span v-if="shopUser && shopUser.name">Bienvenue à la boutique {{ shopUser.name }}</span>
  <span v-else>Bienvenue à la boutique</span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'WelcomeMessage',
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,
    }),
  },
};
</script>


