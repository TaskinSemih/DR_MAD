<template>
  <div>
    <checked-list
        :data="currentBasket.items"
        :fields="['item.name', 'amount', 'Price']"
        :item-button="{ show: true, text: 'Supprimer' }"
        :list-button="{ show: false, text: 'Acheter' }"
        :cancel-button="{ show: false }"
        @item-button-clicked="deleteItemFromBasket"
        @list-button-clicked="basketToOrder"
    />
    <div class="action-buttons">
      <button @click="deleteAllItemFromBasket" class="btn clear-btn">Vider le panier</button>
      <button @click="basketToOrder" class="btn buy-btn">Acheter</button>
    </div>
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
      copySuccess: false,
    };
  },
  methods: {
    deleteItemFromBasket(index) {
      const item = this.currentBasket.items[index];
      this.$store.dispatch('removeItemFromBasket', item);
    },
    deleteAllItemFromBasket() {
      if (this.currentBasket.items.length === 0) {
        alert('Le panier est déjà vide.');
        return;
      }

      if (confirm('Voulez-vous vraiment supprimer tous les articles du panier ?')) {
        this.$store.dispatch('clearBasket')
            .then(() => {
              alert('Tous les articles ont été supprimés du panier.');
            })
            .catch((error) => {
              console.error('Erreur lors de la suppression des articles :', error);
              alert('Une erreur est survenue lors de la suppression des articles.');
            });
      }
    },
    basketToOrder() {
      // Vérification si le panier est vide
      if (this.currentBasket.items.length === 0) {
        alert('Votre panier est vide. Veuillez ajouter des articles avant de passer une commande.');
        return;
      }

      this.$store.dispatch('createOrder').then((order) => {
        this.orderUuid = order.uuid;
        this.showDialog = true;
        this.$store.dispatch('clearBasket');
      }).catch((error) => {
        console.error('Erreur lors de la création de la commande :', error);
        alert('Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
      });
    },
    closeDialog() {
      this.showDialog = false;
      this.copySuccess = false;
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
/* Boutons d'actions supplémentaires */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  text-align: center;
}

.clear-btn {
  background-color: #dc3545; /* Rouge pour Vider */
}

.clear-btn:hover {
  background-color: #a71d2a;
}

.buy-btn {
  background-color: #007bff; /* Bleu pour Acheter */
}

.buy-btn:hover {
  background-color: #0056b3;
}

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
