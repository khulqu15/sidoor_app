<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative grid grid-cols-1 items-center justify-center">
        <div class="absolute w-full h-full z-20 bg-black/50"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonToolbar } from '@ionic/vue';
</script>