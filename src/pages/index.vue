<template>
  <v-container class="fill-height overflow-hidden" style="height: 100vh !important;" fluid>
    <v-row class="h-100">
      <v-col class="h-100" cols="12" md="4">
        <model :style="modelStyle"></model>

        <keyword-activation :keyword="['你好', '小智', '老师']" @trigger="handleKeywordTrigger">
          <template #default="{ loading, loaded, init }">
            <v-btn v-if="!loaded" icon size="80" density="compact" variant="plain" :loading="loading" @click="init">
              <v-avatar size="80">
                <v-img src="@/assets/ai.png"></v-img>
              </v-avatar>
            </v-btn>
          </template>
        </keyword-activation>
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
import { useModelStore } from '@/store/model';

const modelStore = useModelStore()

const display = useDisplay()

const chatClass = display.mobile.value ? ['h-75', 'position-fixed', 'bottom-0', 'left-0'] : ['h-100']

const modelStyle = display.mobile.value ? ['margin-top:-50%;', 'z-index: 0;'] : []

const handleKeywordTrigger = () => {
  console.log('handleKeywordTrigger')
  modelStore.StopAudio()
  modelStore.PushWord(
    '你好，请问有什么需要帮助您的',
    "zh-CN-XiaoxiaoNeural",
    0,
    0,
    0
  );
}
</script>
<style scoped>
.keyword-activation {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>