<template>
  <div>
    <div class="score columns">
      <h3 class="column">
      <Timer ref="timer" class="subtitle"/>
      </h3>
      <h3 class="column subtitle">Remaining {{remainingBombs}}</h3>
    </div>
    <div class="game-container">
      <div v-if="result" class="finish-message">
        <span v-if="result === 'won'">You Won :)</span>
        <span v-if="result === 'lost'">You Lost =/</span>
      </div>
      <Field v-bind:size="20"
      v-bind:mines="60"
      v-bind:key="key"
      v-on:update:remainingBombs="remainingBombs = $event"
      v-on:finish="finish($event)"
      class="field"/>
    </div>
    <div class="action-buttons columns">
      <div class="column">
        <button v-on:click="restart()" class="reset button is-warning">RESET</button>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Field from '@/components/Field.vue';
import Timer from '@/components/Timer.vue';

@Component({
  components: {
    Field,
    Timer,
  },
})
export default class MineSweeper extends Vue {
  public readonly $refs!: {
    timer: Timer;
  };
  private remainingBombs = 60;
  private key = 1;
  private result: null|'won'|'lost' = null;

  private mounted() {
    this.start();
  }

  private start() {
    this.$refs.timer.start();
  }

  private restart() {
    this.result = null;
    this.$refs.timer.reset();
    this.key++;
    this.start();
  }

  private finish(won: boolean) {
    this.result = won ? 'won' : 'lost';
    this.$refs.timer.stop();
  }

}
</script>

<style scoped>
.score {
  text-align: center;
}

.action-buttons{
  text-align: center;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.finish-message {
  position: absolute;
  width: 100%;
  height: 100px;
  z-index: 10;
  text-align: center;
  background-color: rgba(66, 134, 244, .8);
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>