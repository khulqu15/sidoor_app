<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <video id="input-video" autoplay muted></video>
                <canvas id="overlay"></canvas>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { onMounted } from 'vue'

onMounted(() => {
    console.log(faceapi.nets)
})
</script>