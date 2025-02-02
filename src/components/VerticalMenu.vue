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
          <button
            v-else-if="item.type === 'button'"
            @click="goTo(item.to)"
            :disabled="!isAccountValid && item.label !== 'Mon compte'"
            :class="{ disabled: !isAccountValid && item.label !== 'Mon compte' }"
          >
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
  name: "VerticalMenu",
  props: {
    items: {
      type: Array,
      required: true
    },
    submittedAccountNumber: { // Numéro de compte soumis
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isMenuOpen: false,
      validAccounts: [ // Liste des numéros de compte valides
        "FRBADORG78901234567890-0000001",
        "FRBADORG78901234567890-0000002",
        "FRDRMAD578901234567890-0000666",
        "FRSHOP4578901234567890-0000999"
      ]
    };
  },
  computed: {
    isAccountValid() {
      return this.validAccounts.includes(this.submittedAccountNumber);
    }
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
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  border-radius: 4px;
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
  width: 180px;
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
  padding: 10px;
  text-align: left;
  display: block;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  width: 100%;
  border-radius: 4px;
}

/* Désactiver les boutons sauf "Mon compte" */
.vertical-menu button:disabled {
  background-color: #d3d3d3;
  color: #888;
  cursor: not-allowed;
}

/* Garde "Mon compte" actif */
.vertical-menu button:not(:disabled) {
  background-color: #007bff;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
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
