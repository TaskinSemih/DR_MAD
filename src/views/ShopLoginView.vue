<template>
  <div class="login-container">
    <h1 class="title">Login</h1>

    <div class="form-group">
      <label for="login">Login</label>
      <input id="login" v-model="login" type="text" placeholder="Enter your login" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" placeholder="Enter your password" />
    </div>

    <button @click="shopLogin({ login, password })" class="btn">Login</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ShopLoginView",
  data: () => ({
    login: "",
    password: "",
  }),
  computed: {
    ...mapState({
      shopUser: (state) => state.shopUser,
    }),
  },
  methods: {
    ...mapActions({
      shopLogin: "shopLogin",
    }),
  },
};
</script>

<style scoped>
/* Container */
.login-container {
  max-width: 400px;
  margin: 5% auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Title */
.title {
  font-size: 28px;
  margin-bottom: 1.5rem;
  color: #007bff;
}

/* Form group */
.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Button */
.btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
