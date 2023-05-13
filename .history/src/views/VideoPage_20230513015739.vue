<template>
    <div>
      <div class="center-content page-container">
        <div>
          <div class="row center-content" v-if="isLoading">
            <input disabled :value="statusText" type="text" class="bold" />
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
          </div>
          <div class="row center-content">
            <video ref="videoEl" autoplay muted></video>
          </div>
          <div class="row">
            <label for="prediction">Prediction:</label>
            <input disabled :value="prediction" type="text" class="bold" />
          </div>
          <div class="row">
            <label for="time">Time:</label>
            <input disabled :value="time" type="text" class="bold" />
          </div>
          <div class="row">
            <label for="fps">Estimated Fps:</label>
            <input disabled :value="fps" type="text" class="bold" />
          </div>
          <div class="row">
            <button class="waves-effect waves-light btn" @click="toggleStop">
              {{ stopButtonText }}
            </button>
            <button class="waves-effect waves-light btn" @click="slower">
              <i class="material-icons left">-</i> Slower
            </button>
            <button class="waves-effect waves-light btn" @click="faster">
              <i class="material-icons left">+</i> Faster
            </button>
          </div>
          <div class="row">
            <label for="interval">Interval:</label>
            <input disabled :value="interval" type="text" class="bold" />
          </div>
        </div>
      </div>
    </div>
</template>