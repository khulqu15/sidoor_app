<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative">
        <div class="absolute w-full h-full z-20 bg-black/50"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
        <div class="grid grid-cols-1 items-center min-h-screen justify-center">
          <div class="relative z-30 text-white w-3/4">
            Hallo
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonToolbar } from '@ionic/vue';
</script>