<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <div style="position: relative; width: 500px" class="margin">
                    <video @play="onPlay()" id="inputVideo" autoplay muted></video>
                    <canvas id="overlay"></canvas>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { MtcnnOptions } from 'face-api.js'
import { onMounted } from 'vue'

const videoEl = document.getElementById("inputVideo") as HTMLVideoElement
const canvas = document.getElementById('overlay') as HTMLCanvasElement;

onMounted(async() => {
    run()
})

async function run() {
    await faceapi.loadMtcnnModel("/")
    await faceapi.loadFaceRecognitionModel("/")
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            })
            if(videoEl) videoEl.srcObject = stream
        } catch(error) {
            console.log("Any Error: ", error)
        }
    }
    console.log("play")
    faceapi.matchDimensions(canvas, videoEl)
    const mtcnnForwardParams = new MtcnnOptions({
        maxNumScales: 10,
        scaleFactor: 0.709,
        scoreThresholds: [0.6, 0.7, 0.7],
        minFaceSize: 100
    })
    const mtcnnResults = await faceapi.mtcnn(videoEl, mtcnnForwardParams)
    faceapi.draw.drawDetections(canvas, mtcnnResults.map(res => res.detection))
    faceapi.draw.drawFaceLandmarks(canvas, mtcnnResults.map(res => res.landmarks))
}

function onPlay() {
    console.log("play")
}
</script>

<style>
.page-container {
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 20px;
  padding-left: 280px;
  display: inline-flex !important;
}

@media only screen and (max-width : 992px) {
  .page-container {
    padding-left: 0;
    display: flex !important;
  }
}

#navbar {
  position: absolute;
  top: 20px;
  left: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.side-by-side {
  display: flex;
  justify-content: center;
  align-items: center;
}
.side-by-side >* {
  margin: 0 5px;
}

.bold {
  font-weight: bold;
}

.margin-sm {
  margin: 5px;
}

.margin {
  margin: 20px;
}

.button-sm {
  padding: 0 10px !important;
}

.pad-sides-sm {
  padding: 0 8px !important;
}

#overlay, .overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  right: 0;
  bottom: 0;
  left: 0;
}

#facesContainer canvas {
  margin: 10px;
}

input[type="file"]::-webkit-file-upload-button {
    background: #26a69a;
    border: 1px solid gray;
    cursor: pointer;
    color: #fff;
    border-radius: .2em;
}
</style>