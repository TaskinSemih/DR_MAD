<template>
  <div class="vertical-menu">
    <div v-for="(item, index) in items" :key="index">
      <template v-if="item.type === 'title'">
        <slot name="menu-title" :label="item.label">{{ item.label }}</slot>
      </template>
      <button v-else-if="item.type === 'button'" @click="goTo(item.to)">
        <slot name="menu-link" :label="item.label">
          {{ item.label }}
        </slot>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalMenu',
  props: {items: Array},
  methods: {
    goTo(dest) {
      if (this.$route.path !== dest) this.$router.push(dest);
    }
  }
}
</script>

<style scoped>
.vertical-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.vertical-menu div {
  margin-bottom: 10px;
}

.vertical-menu button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition-duration: 0.4s;
}

.vertical-menu button:hover {
  background-color: #45a049;
  color: white;
}
</style>