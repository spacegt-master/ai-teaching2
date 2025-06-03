<template>
  <v-container class="fill-height overflow-hidden" style="height: 100vh !important;" fluid>
    <v-row class="h-100">
      <v-col class="h-100" cols="12" md="4">
        <model :style="modelStyle"></model>
      </v-col>

      <v-col :class="chatClass" cols="12" md="8">
        <chat></chat>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Model from './model.vue'
import Chat from './chat.vue'
import { useDisplay } from 'vuetify';

const display = useDisplay()
console.log(display.mobile)
const chatClass = display.mobile.value ? ['h-75', 'position-fixed', 'bottom-0', 'left-0' ] : ['h-100']


const modelStyle = display.mobile.value ? ['margin-top:-50%;','z-index: 0;'] : []
</script>
<style scoped></style>