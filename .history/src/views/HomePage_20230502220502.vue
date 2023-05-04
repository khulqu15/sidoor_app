<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative">
        <div class="absolute w-full h-full z-20 bg-black/70"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
        <div class="grid grid-cols-1 items-center min-h-screen justify-items-center">
          <div class="relative z-30 text-white w-full text-center py-12 transition-all rounded-2xl">
            <div id="hello" class="animate__animated animate__fadeInDown text-4xl font-bold">Hello, I'm Sidoor</div>
            <div id="smart_door" class="text-2xl font-bold hidden">Secure your home door with <br> our advanced technology</div>
            <div id="enjoy_it" class="text-3xl font-bold hidden">Enjoy convenience and security at your fingertips</div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      data_ref: 0,
    }
  },
  mounted() {
    this.runLoading()
  },
  methods: {
    runLoading() {
      const text_hello: HTMLElement | null = document.getElementById('hello')
      const smart_door: HTMLElement | null = document.getElementById('smart_door')
      const enjoy_it: HTMLElement | null = document.getElementById('enjoy_it')
      setTimeout(() => {
        text_hello?.classList.remove('animate__animated', 'animate__fadeInDown')
        text_hello?.classList.add('animate__animated', 'animate__fadeOutDown', 'hidden')
      }, 3000);
      setTimeout(() => {
        smart_door?.classList.remove('hidden')
        smart_door?.classList.add('animate__animated', 'animate__fadeInLeft')
      }, 4000);
      setTimeout(() => {
        smart_door?.classList.remove('animate__animated', 'animate__fadeInLeft')
        smart_door?.classList.add('animate__animated', 'animate__fadeOutLeft', 'hidden')
      }, 5000)
      setTimeout(() => {
        enjoy_it?.classList.remove('hidden')
        enjoy_it?.classList.add('animate__animated', 'animate__fadeInLeft')
      }, 5000);
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
* {
  font-family: 'Montserrat', sans-serif;
  /* font-family: 'Lobster', sans-serif; */
}
</style>
