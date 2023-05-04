<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative">
        <div class="absolute w-full h-full z-20 bg-black/50"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
        <div class="grid grid-cols-1 items-center min-h-screen justify-items-center">
          <div class="relative z-30 text-white w-3/4 text-center p-4 bg-black/50 rounded-2xl backdrop-blur">
            <div class="text-2xl font-bold">HELLO</div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
* {
  font-family: 'Montserrat', sans-serif;
}
</style>
