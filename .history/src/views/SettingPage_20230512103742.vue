<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen w-full relative overflow-hidden">
                <div class="absolute w-full h-full z-20 bg-black/70"></div>
                <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
                <div class="grid text-white relative z-30 grid-cols-1 items-center min-h-screen justify-items-center p-8">
                    <div>
                        <h3>Setting Parameter</h3>
                        <label for="timer">Timer Auto Close Door</label>
                        <input type="text" placeholder="Type here" class="input w-full bg-black/20" />
                    </div>

                </div>
            </div>
        </ion-content>
    </ion-page>
</template>