<template>
  <div> <!-- Élément racine encapsulant tout le contenu -->
    <checked-list
        :data="currentBasket.items"
        :fields="['item.name', 'amount', 'Price']"
        :item-button="{show: true, text: 'Supprimer'}"
        :list-button="{show: true, text: 'Acheter'}"
        :cancel-button="{show: false}"
        @item-button-clicked="deleteItemFromBasket"
        @list-button-clicked="basketToOrder"
    />
    <!-- Fenêtre de dialogue -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h2>Commande créée</h2>
        <p>UUID: {{ orderUuid }}</p>
        <div class="dialog-buttons">
          <button @click="copyUuid">Copier l'UUID</button>
          <button @click="closeDialog">OK</button>
        </div>
        <p v-if="copySuccess" class="copy-success">UUID copié avec succès !</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CheckedList from './CheckedList.vue';

export default {
  name: 'BasketList',
  components: {
    CheckedList,
  },
  computed: {
    ...mapGetters(['currentBasket']),
    shopUser() {
      return this.$store.state.shop.shopUser;
    },
  },
  data() {
    return {
      showDialog: false,
      orderUuid: '',
      copySuccess: false, // Indique si la copie a réussi
    };
  },
  methods: {
    deleteItemFromBasket(index) {
      const item = this.currentBasket.items[index];
      this.$store.dispatch('removeItemFromBasket', item);
    },
    basketToOrder() {
      this.$store.dispatch('createOrder').then((order) => {
        this.orderUuid = order.uuid; // Stocke l'UUID
        this.showDialog = true; // Affiche le dialogue
        this.$store.dispatch('clearBasket'); // Vide le panier
      });
    },
    closeDialog() {
      this.showDialog = false; // Ferme le dialogue
      this.copySuccess = false; // Réinitialise l'état de la copie
    },
    copyUuid() {
      if (this.orderUuid) {
        navigator.clipboard.writeText(this.orderUuid)
            .then(() => {
              this.copySuccess = true; // Affiche un message de succès
              setTimeout(() => {
                this.copySuccess = false; // Masque le message après 2 secondes
              }, 2000);
            })
            .catch((err) => {
              console.error('Erreur lors de la copie :', err);
            });
      }
    },
  },
};
</script>

<style>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.dialog-box h2 {
  margin: 0 0 10px;
}

.dialog-box p {
  margin: 0 0 20px;
}

.dialog-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.dialog-box button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.dialog-box button:hover {
  background-color: #04438f;
}

.copy-success {
  color: #28a745;
  margin-top: 10px;
  font-weight: bold;
}
</style>
