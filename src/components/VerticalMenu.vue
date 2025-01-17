<template>
  <div class="burger-menu">
    <button class="burger-icon" @click="toggleMenu">
      &#9776; <!-- Icône du menu burger -->
    </button>
    <transition name="menu-fade">
      <div v-if="isMenuOpen" class="vertical-menu">
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
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BurgerMenu',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    goTo(dest) {
      if (this.$route.path !== dest) this.$router.push(dest);
      this.isMenuOpen = false; // Ferme le menu après la navigation
    }
  }
};
</script>

<style scoped>
.burger-menu {
  position: relative;
}

.burger-icon {
  background-color: #007bff;
  color: white;
  border: none;
  width: 50px; /* Largeur légèrement augmentée */
  height: 50px; /* Taille ajustée */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  border-radius: 4px; /* Ajout d'une bordure arrondie pour plus de style */
}

.burger-icon:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.vertical-menu {
  position: absolute;
  top: 50px;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 150px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.vertical-menu div {
  margin-bottom: 10px;
}

.vertical-menu button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: left;
  text-decoration: none;
  display: block;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.vertical-menu button:hover {
  background-color: #0056b3;
  transform: translateX(5px);
}

.menu-fade-enter-active, .menu-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.menu-fade-enter {
  opacity: 0;
  transform: translateY(-20px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
