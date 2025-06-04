<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { BubbleProps, BubbleListProps, PromptsProps } from 'ant-design-x-vue'
import markdownit from 'markdown-it';
import {
  UserOutlined
} from '@ant-design/icons-vue'
import { Space, Typography, theme } from 'ant-design-vue'
import {
  Bubble,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
} from 'ant-design-x-vue'
import { computed, h, nextTick, ref, watch } from 'vue'
import { useGlobalStore } from '@/store/global';
import { useModelStore } from '@/store/model';

const dataStore = useGlobalStore()

const display = useDisplay()

const modelStore = useModelStore()

const md = markdownit({ html: true, breaks: true });

const { token } = theme.useToken()

const dialog = ref(false)

const dialogItem = ref()

const styles = computed(() => {
  return {
    'layout': {
      'width': '100%',
      'min-width': '100%',
      'height': '100%',
      'border-radius': `${token.value.borderRadius}px`,
      'display': 'flex',
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
      'background': `linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1))`,
    },
    'menu': {
      'background': `${token.value.colorBgLayout}80`,
      'width': '280px',
      'height': '100%',
      'display': 'flex',
      'flex-direction': 'column',
    },
    'conversations': {
      'padding': '0 12px',
      'flex': 1,
      'overflow-y': 'auto',
    },
    'chat': {
      'height': '100%',
      'width': '100%',
      'margin': '0 auto',
      'box-sizing': 'border-box',
      'display': 'flex',
      'flex-direction': 'column',
      'padding': `${display.smAndDown.value ? 0 : token.value.paddingLG}px`,
      'gap': '16px',
    },
    'messages': {
      flex: 1,
    },
    'placeholder': {
      'padding-top': '32px',
      'text-align': 'left',
      'flex': 1,
    },
    'sender': {
      'box-shadow': token.value.boxShadow,
    },
    'logo': {
      'display': 'flex',
      'height': '72px',
      'align-items': 'center',
      'justify-content': 'start',
      'padding': '0 24px',
      'box-sizing': 'border-box',
    },
    'logo-img': {
      width: '24px',
      height: '24px',
      display: 'inline-block',
    },
    'logo-span': {
      'display': 'inline-block',
      'margin': '0 8px',
      'font-weight': 'bold',
      'color': token.value.colorText,
      'font-size': '16px',
    },
    'addBtn': {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      width: 'calc(100% - 24px)',
      margin: '0 12px 24px 12px',
    },
  } as const
})

const renderMarkdown: BubbleProps['messageRender'] = (content) =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  });

defineOptions({ name: 'PlaygroundIndependentSetup' })


const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: '16px',
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
}

const files = ref([])

// ==================== State ====================
const content = ref('')
const activeKey = ref(dataStore.defaultConversationsItems[0].key)
const agentRequestLoading = ref(false)

// ==================== Runtime ====================
const [agent] = useXAgent({
  request: async ({ message }, { onSuccess, onUpdate }) => {
    agentRequestLoading.value = true

    let fullContent = ''

    files.value = []

    onUpdate('')

    const eventSource = new EventSource(`${import.meta.env.VITE_APP_BASE_SERVER}/${import.meta.env.VITE_APP_MODEL}?prompt=${message}`);

    eventSource.onopen = () => console.log('SSE connection opened.');

    eventSource.onmessage = (event) => {

      const result = JSON.parse(event.data)

      if (result.type == 'MESSAGE') {
        fullContent += result.answer

        modelStore.draftBuffer += result.answer

        onUpdate(fullContent);
      }

      if (result.type == 'RESOURCE') {
        files.value = result.resources
        
        files.value.sort((a: any, b: any) => a.extension == b.extension ? 0 : a.extension == '.mp4' ? -1 : 1)

        if (files.value?.length > 0)
          files.value = [files.value[0]]
      }
    };

    eventSource.onerror = (e) => {
      eventSource.close()

      onSuccess(fullContent)

      agentRequestLoading.value = false
    };
  },
})

const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
})

watch(activeKey, () => {
  if (activeKey.value !== undefined) {
    setMessages([])
  }
}, { immediate: true })

const openDialog = (item: any) => {
  dialogItem.value = item

  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false

  nextTick(() => {
    dialogItem.value = null
  })
}

// ==================== Event ====================
function onSubmit(nextContent: string) {
  if (!nextContent)
    return
  onRequest(nextContent)
  content.value = ''
}

const onPromptsItemClick: PromptsProps['onItemClick'] = (info) => {
  onRequest(info.data.description as string)
}

// ==================== Nodes ====================
const placeholderNode = computed(() => h(
  Space,
  { direction: "vertical", size: 16, style: styles.value.placeholder },
  () => [
    h(
      Welcome,
      {
        variant: "borderless",
        icon: "https://yigee-file.oss-cn-beijing.aliyuncs.com/ai-teaching2/images/avatar.jpg",
        title: dataStore.title,
        description: dataStore.description,
      }
    ),
    h(
      Prompts,
      {
        title: "你想问什么?",
        items: dataStore.placeholderPromptsItems,
        styles: display.smAndDown.value ? {} : {
          list: { width: '100%', },
          item: { flex: 1, },
        },
        onItemClick: onPromptsItemClick,
      }
    )
  ]
))

const items = computed<any>(() => {
  if (messages.value.length === 0) {
    return [{ content: placeholderNode, variant: 'borderless' }]
  }

  return messages.value.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading' && message.length == 0,
    role: status === 'local' ? 'local' : 'ai',
    avatar: { icon: h(UserOutlined) },
    content: message,
    header: status === 'local' ? null : 'AI 助教',
    messageRender: status === 'local' ? null : renderMarkdown,
  }))
})

</script>

<template>
  <div class="h-100 " :style="styles.layout">

    <div :style="styles.chat">
      <!-- 🌟 消息列表 -->
      <Bubble.List :items="items" :roles="roles" :style="styles.messages" />

      <Fancybox :options="{
        Carousel: {
          infinite: false,
        },
      }">
        <v-list class="ml-8" v-if="files.length > 0" max-width="500px">
          <v-list-item prepend-icon="mdi-paperclip" title="附件">
            <template #append>
              <v-btn icon="mdi-close" variant="plain" @click="files = []"></v-btn>
            </template>
          </v-list-item>

          <v-list max-height="100px" item-props :items="files" lines="two">
            <template #item="{ props: itemProps }">
              <a v-if="['.mp4', '.png', '.jpg'].includes(itemProps.extension)" data-fancybox="gallery"
                :href="itemProps.previewUrl">
                <attachement :itemProps="itemProps" @click="modelStore.StopAudio()"></attachement>
              </a>

              <attachement v-else :itemProps="itemProps" @click="openDialog(itemProps); modelStore.StopAudio()">
              </attachement>
            </template>
          </v-list>
        </v-list>
      </Fancybox>

      <!-- 🌟 提示词 -->
      <Prompts :items="dataStore.senderPromptsItems" @item-click="onPromptsItemClick" />

      <!-- 🌟 输入框 -->
      <Sender :value="content" :style="styles.sender" :allow-speech="true" :loading="agentRequestLoading"
        @submit="onSubmit" @change="value => content = value">
      </Sender>
    </div>

    <v-dialog v-model="dialog" max-width="800" fullscreen>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h6 text-medium-emphasis ps-2 v-list-item-title">
              {{ dialogItem?.name }}
            </div>

            <v-btn icon="mdi-close" variant="text" @click="closeDialog()"></v-btn>
          </v-card-title>

          <v-divider class="mb-4"></v-divider>

          <v-card-text>
            <iframe class="w-100 h-100 border-0" :src="dialogItem?.previewUrl"></iframe>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style scoped>
:deep(.ant-welcome-icon) {
  border-radius: 50%;
  overflow: hidden;
  width: 54px;
  flex-shrink: 0;
}

:deep(.ant-bubble-content-borderless),
:deep(.ant-bubble-content-borderless>div) {
  width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

a:visited {
  color: inherit;
}

a:active {
  color: inherit;
}

a:focus {
  outline: none;
}

p {
  margin: 0;
}
</style>