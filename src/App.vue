<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useGlobalStore } from './store/global';

const globalData = useGlobalStore()

document.title = globalData.app
</script>
<style>
html,
body,
#app {
  overflow: hidden;
}
</style>
