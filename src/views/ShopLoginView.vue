<template>
  <div class="center">
    <h1>Login</h1>

    <span>login</span><input v-model="login">
    <span>password</span><input v-model="password">
    <button @click="shopLogin({login, password})">Login</button>
  </div>

</template>

<script>

import {mapState, mapActions} from 'vuex'

export default {
  name: 'ShopLoginView',
  data: () => ({
    login: '',
    password: '',
  }),
  computed: {
    ...mapState({
      shopUser: (state) => state.shopUser
    }),
  },
  methods: {
    ...mapActions({
      shopLogin: 'shopLogin'
    }),
  }
}
</script>
<style scoped>

body {
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

h1 {
  font-size: 24px;
}

span {
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


</style>