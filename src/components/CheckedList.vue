<template>
  <div>
    <table>
      <thead>
      <tr>
        <th v-if="itemCheck"></th>
        <th v-for="(field, index) in fields" :key="index">
          {{ field }}
        </th>
        <th v-if="itemAmount"></th>
        <th v-if="itemButton"></th>
        <th v-if="cancelButton"></th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-if="itemCheck">
          <input type="checkbox" :checked="checked[index] ?? false "
                 @change="$emit('check-toggled', index, $event.target.checked)">
        </td>
        <td v-for="(field, index) in fields" :key="index">
          {{ field === 'Price' ? calculatePrice(item) : getField(item, field) }}
        </td>
        <td v-if="itemAmount">
          <input type="number" value="0" min="1"
                 v-model="amounts[index]"
                 @change="$emit('amount-changed', index, $event.target.value)">
        </td>
        <td>
          <button v-if="typeof itemButton.show === 'function' ? itemButton.show(index) : itemButton.show"
                  @click="$emit('item-button-clicked', index)">{{ itemButton.text }}
          </button>
          <!--          <button v-if="cancelButton.show" @click="$emit('item-cancel-button-clicked', index)">{{ cancelButton.text }}</button>-->
          <button v-if="typeof cancelButton.show === 'function' ? cancelButton.show(index) : cancelButton.show"
                  @click="$emit('item-cancel-button-clicked', index)">{{ cancelButton.text }}
          </button>
        </td>
      </tr>
      </tbody>

    </table>
    <button v-if="listButton.show" @click="$emit('list-button-clicked')">{{ listButton.text }}</button>
  </div>
</template>

<script>


export default {
  name: 'CheckedList',
  props: {
    data: Array, // les données sources
    fields: Array, // le tableau contenant le nom des champs
    itemCheck: Boolean, // s'il y a des case à cocher
    checked: Array, // le tableau des cases cochées
    itemButton: Object, // l'objet pour les boutons d'items
    listButton: Object, // l'objet pour le bouton de liste,
    cancelButton: Object,
    itemAmount: Boolean,
  },
  created() {
    console.log(this.itemAmount);
  },
  data: () => {
    return {
      amounts: [],
    }
  },
  methods: {
    calculatePrice(item) {
      return item.item.price * item.amount * (1 - item.item.promotion[0].discount / 100);
    },
    getField(item, field) {
      const keys = field.split('.');
      let value = item;
      for (let key of keys) {
        value = value[key];
      }
      if (field === 'promotion') {
        return value.map(promo => promo.discount + '%').join(' | ');
      }
      if (field === 'Price') {
        return this.calculatePrice(item);
      }
      return value;
    },
  }
}
</script>

<style>

</style>