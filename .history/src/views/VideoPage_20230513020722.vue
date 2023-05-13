<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <img id="person1" src="/datasets/ninno/1.jpg" alt="person1">
                <img id="person2" src="/datasets/ninno/2.jpg" alt="person1">
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { onMounted } from 'vue'

onMounted(async() => {
    await faceapi.loadSsdMobilenetv1Model("/")
    await faceapi.loadFaceLandmarkModel("/")
    await faceapi.loadFaceRecognitionModel("/")
    const input = document.getElementById('person1') as HTMLImageElement;
    let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
    fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions)
})
</script>