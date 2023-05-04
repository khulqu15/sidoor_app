<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full">
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
        <div class="absolute z-20 bg-black/20"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonToolbar } from '@ionic/vue';
</script>