<template>
    <div class="position-relative"
        :class="[display.mobile ? 'mobile-container' : 'model-container', display.mobile ? 'overflow-hidden' : '']">
        <div id="unity-container" class="unity-desktop">
            <canvas id="unity-canvas"
                style="background-color: transparent; width: 120%; height: 130%; margin-left: -10%;"></canvas>
            <div id="unity-loading-bar">
                <div id="unity-logo"></div>
                <div id="unity-progress-bar-empty">
                    <div id="unity-progress-bar-full"></div>
                </div>
            </div>
        </div>

        <v-overlay v-model="overlay" class="align-center justify-center" contained>
            <v-list class="py-2" color="primary" elevation="12" rounded="lg">
                <v-list-item title="Loading the model...">
                    <template v-slot:prepend>
                        <div class="pe-4">
                            <v-img src="/imgs/logo.png" width="28px"></v-img>
                        </div>
                    </template>

                    <template v-slot:append>
                        <v-progress-circular class="ml-2" color="primary" indeterminate="disable-shrink" size="16"
                            width="2"></v-progress-circular>
                    </template>
                </v-list-item>
            </v-list>
        </v-overlay>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useModelStore } from '@/store/model'
import { useDisplay } from 'vuetify'

const display = useDisplay()

const modelStore = useModelStore()

const overlay = ref(false)

watch(() => display.mobile, (value) => {
    if (value) {
        modelStore.ShowBackPanel('true')
    } else {
        modelStore.ShowBackPanel('false')
    }
})

const load = () => {
    overlay.value = true

    var container = document.querySelector("#unity-container");
    var canvas = document.querySelector("#unity-canvas");
    var loadingBar = document.querySelector("#unity-loading-bar");
    var progressBarFull = document.querySelector("#unity-progress-bar-full");

    // const baseUrl = 'https://human-avatars.oss-cn-beijing.aliyuncs.com/carton/Build/yg_carton'
    // var loaderUrl = baseUrl + ".loader.js";
    // var config = {
    // 	dataUrl: baseUrl + ".data.unityweb",
    // 	frameworkUrl: baseUrl + ".framework.js.unityweb",
    // 	codeUrl: baseUrl + ".wasm.unityweb",
    // 	streamingAssetsUrl: "StreamingAssets",
    // 	companyName: "Yigee",
    // 	productName: "3DHuman",
    // 	productVersion: "0.1",
    // 	// showBanner: unityShowBanner,
    // };

    const baseUrl = 'https://cloud-yigee.oss-cn-hangzhou.aliyuncs.com/dev-unzip/2024/08/YGHumanV1.0/Build/YigeHuman'
    var loaderUrl = baseUrl + ".loader.js";
    var config = {
        dataUrl: baseUrl + ".data.unityweb",
        frameworkUrl: baseUrl + ".framework.js.unityweb",
        codeUrl: baseUrl + ".wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Yigee",
        productName: "3DHuman",
        productVersion: "0.1",
        // showBanner: unityShowBanner,
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content =
            'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        container.className = "unity-mobile";
        canvas.className = "unity-mobile";

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        // config.devicePixelRatio = 1;

        // unityShowBanner('WebGL builds are not supported on mobile devices.');
    }

    loadingBar.style.display = "block";
    window.isPlaying = 1;

    var script = document.createElement("script");
    var unityDesktop = document.querySelector("#unity-container");
    script.src = loaderUrl;

    script.onload = () => {
        createUnityInstance(canvas, config, (progress: number) => {
            progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance: any) => {
            modelStore.loaded = true
            modelStore.unityInstance = unityInstance;
            loadingBar.style.display = "none";

            setTimeout(() => {
                if (display.mobile) {
                    modelStore.ShowBackPanel('true')
                } else {
                    modelStore.ShowBackPanel('false')
                }
                unityDesktop.style.opacity = 1;

                overlay.value = false
            }, 2500)
        }).catch((message: any) => {
            alert(message);
        });
    };
    document.body.appendChild(script);
}

onMounted(() => {
    load()
})
</script>

<style scoped>
.model-container {
    z-index: 1000;
    height: calc(100vh - 50px);
    overflow: hidden;
}

#unity-container {
    opacity: 0;
    height: 100%;
    width: 100%;
}
</style>

<style scoped>
.mobile-container {
    height: 100%;
    width: 100%;
    bottom: 0px;
    position: absolute;
    /* flex-direction: column;
		justify-content: flex-end; */
    box-sizing: border-box;
}
</style>