<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen w-full relative overflow-hidden">
                <div class="absolute w-full h-full z-20 bg-black/70"></div>
                <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
                <div class="grid text-white relative z-30 grid-cols-1 items-center min-h-screen justify-items-center p-8">
                    <div>
                        <h3 class="mb-8 font-bold">Setting Parameter</h3>
                        <div>
                            <label class="text-white" for="timer">Timer Auto Close Door (Second)</label>
                            <input type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div>
                            <label class="text-white" for="timer">PIN VALUE</label>
                            <input type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                    </div>

                </div>
            </div>
        </ion-content>
    </ion-page>
</template>