<template>
  <table>
    <tr v-for="(row, rowIdx) in field" v-bind:key="rowIdx">
        <td v-for="(cell, columnIdx) in row" v-bind:key="columnIdx"
          v-bind:class="{ unknown: !cell.known, exploded: cell.showMine() }" v-on:click="setSellKnown(rowIdx, columnIdx)">
          <span v-if="cell.known">
            {{ cell.neighborHood }}
          </span>
        </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

class Cell {
  mine = false;
  known = false;
  flagged = false;
  neighborHood = 0;

  showMine() {
    return this.mine && this.known;
  }
}

@Component
export default class Field extends Vue {
  @Prop({ default: 10 }) private size!: number;
  @Prop({ default: 10 }) private mines!: number;
  private field: Cell[][] = [];

  created() {
    console.log(this.size);
    for (let i = 0; i != this.size; i++) {
      this.field.push([]);
      for (let j = this.size; j--; ) {
        this.field[i].push(new Cell());
      }
    }

    this.initMines();
  }

  private initMines() {
    for (let i = this.mines; i--; ) {
      let randomX;
      let randomY;
      do {
        randomX = Field.getRandomInt(this.size);
        randomY = Field.getRandomInt(this.size);
      } while (this.field[randomX][randomY].mine);

      this.field[randomX][randomY].mine = true;
      this.addMineNeighbor(randomX, randomY);
    }
  }

  private addMineNeighbor(mineX: number, mineY: number) {
    for (let x = mineX - 1; x <= mineX + 1; x++) {
      for (let y = mineY - 1; y <= mineY + 1; y++) {
          if (x < 0 || x >= this.size || y < 0 || y >= this.size) continue;
          if (x == y) continue;
          this.field[x][y].neighborHood++;
      }

    }
  }

  private setSellKnown(x: number, y: number) {
    this.field[x][y].known = true;
    // #TODO find all 0 around recursively
  }

  private static getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }  

}
</script>

<style scoped>
td {
  width: 15px;
  height: 15px;
  margin: 1px;
}

.unknown {
  background-color: blue
}

.exploded {
  background-color: red
}

</style>
