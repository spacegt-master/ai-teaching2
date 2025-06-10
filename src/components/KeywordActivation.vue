<template>
    <div id="wrapper" class="keyword-activation">
        <slot :loading="loading" :loaded="loaded" :init="init">
            <div v-if="!loaded">
                <v-btn prepend-icon="mdi-apple-keyboard-command" variant="plain" :loading="loading" @click="init">
                    开启关键词唤醒
                </v-btn>

                <div class="text-caption pa-4">
                    {{ recognitionResult.join(',') }}
                </div>

                <span class="text-caption pa-4">{{ partial }}</span>
            </div>
        </slot>
    </div>
</template>

<script setup>
import { useTimestamp } from '@vueuse/core'
import { ref } from 'vue'

const emit = defineEmits(['trigger'])

const props = defineProps({
    keyword: Object
})

const timestamp = useTimestamp({ offset: 0 })

let lastRecognitionTimestamp = 0

const recognitionResult = ref([])

const partial = ref('')

const loading = ref(false)

const loaded = ref(false)

const trigger = (partial) => {
    if (timestamp.value - 3000 > lastRecognitionTimestamp) {
        lastRecognitionTimestamp = timestamp.value
        emit('trigger')
    }
}

async function init() {
    loading.value = true

    const channel = new MessageChannel();
    const model = await Vosk.createModel('/vosk/vosk-model-small-cn-0.22.zip');
    model.registerPort(channel.port1);

    const sampleRate = 48000;

    const recognizer = new model.KaldiRecognizer(sampleRate);
    recognizer.setWords(true);

    recognizer.on("result", (message) => {
        let result = message.result;

        result = result.text.replace(/\s/g, "")

        if (result)
            recognitionResult.value.push(result)
    });
    recognizer.on("partialresult", (message) => {
        const result = message.result.partial;

        partial.value = result;

        if (props.keyword && props.keyword.every(item => partial.value.includes(item))) {
            trigger(partial.value)
        }
    });

    loading.value = false
    loaded.value = true

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            channelCount: 1,
            sampleRate
        },
    });

    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule('/vosk/recognizer-processor.js')
    const recognizerProcessor = new AudioWorkletNode(audioContext, 'recognizer-processor', { channelCount: 1, numberOfInputs: 1, numberOfOutputs: 1 });
    recognizerProcessor.port.postMessage({ action: 'init', recognizerId: recognizer.id }, [channel.port2])
    recognizerProcessor.connect(audioContext.destination);

    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(recognizerProcessor);
}

</script>

<style scoped>
#wrapper {
    max-width: 900px;
    margin: auto;
    padding: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

#trigger {
    align-self: flex-start;
    margin: auto;
}
</style>