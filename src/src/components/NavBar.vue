<template>
  <nav>
    <div class="nav-links">
      <button v-for="(link, index) in links"
              :key="index"
              @click="goTo(link.to)"
      >
        <slot name="nav-button" :label="link.label">{{ link.label }}</slot>
      </button>
    </div>
  </nav>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'NavBar',
  props: {links: Array},
  computed: {
    ...mapState({
      shopUser: state => state.shop.shopUser,
    }),
  },
  methods: {
    goTo(dest) {
      if (this.$route.path !== dest) this.$router.push(dest);
    },
  }
}
</script>

<style scoped>
nav .nav-links {
  display: flex;
  align-items: center;
}

nav div a {
  color: #00ff00;
  text-decoration: none;
  padding: 5px 10px;
  background-color: #000;
  border: 1px solid #00ff00;
  border-radius: 3px;
  margin-right: 10px;
  font-family: monospace;
}

nav div a:hover {
  background-color: #007f00;
}
</style>