<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <video ref="videoEl" id="input-video" autoplay muted></video>
                <canvas id="overlay"></canvas>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { MtcnnOptions } from 'face-api.js'
import * as faceapi from 'face-api.js'
import { onMounted, ref } from 'vue'
const videoEl = ref<HTMLVideoElement | null>(null);

const mtcnnForwardParams = new MtcnnOptions({
  maxNumScales: 10,
  scaleFactor: 0.709,
  scoreThresholds: [0.6, 0.7, 0.7],
  minFaceSize: 200
})

onMounted(() => {
    run()
})
async function run() {
    await faceapi.loadMtcnnModel('/')
    const videoElement = document.getElementById('input-video') as HTMLVideoElement;
    if(videoElement){
      const mtcnnResults = await faceapi.mtcnn(videoElement, mtcnnForwardParams)
    }
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
