<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <video ref="" id="input-video" autoplay muted></video>
                <canvas id="overlay"></canvas>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { onMounted, ref } from 'vue'
const videoEl = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    run()
})
async function run() {
    await faceapi.loadMtcnnModel('/')
    await faceapi.loadFaceRecognitionModel('/')
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
            if(videoEl.value) videoEl.value.srcObject = stream;
        })
        .catch((error) => {
            console.error('An error occurred: ', error);
        })
}
</script>