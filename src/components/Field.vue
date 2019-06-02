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
import { Cell } from './cell';


interface CellWithPosition {
  cell: Cell;
  x: number;
  y: number;
}

@Component
export default class Field extends Vue {
  private static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  @Prop({ default: 10 }) private size!: number;
  @Prop({ default: 10 }) private mines!: number;
  private field: Cell[][] = [];

  private created() {
    for (let i = 0; i !== this.size; i++) {
      this.field.push([]);
      for (let j = this.size; j--; ) {
        this.field[i].push(new Cell());
      }
    }

    this.initMines();
  }

  private initMines() {
    // #TODO delay this until first click
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

  private addMineNeighbor(x: number, y: number) {
    this.forAllNeighbors(x, y, (c) => c.cell.neighborHood++);
  }

  private setSellKnown(x: number, y: number) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return;
    }

    const cell = this.field[x][y];

    if (cell.known) {
      return;
    }

    cell.known = true;

    if (!cell.mine && cell.neighborHood === 0) {
      this.forAllNeighbors(x, y, (ncell) => this.setSellKnown(ncell.x, ncell.y));
    }
  }

  private forAllNeighbors(x: number, y: number, callback: (cell: CellWithPosition) => any) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
          if (i < 0 || i >= this.size || j < 0 || j >= this.size) {
            continue;
          }
          if (i === x && j === y) {
            continue;
          }

          callback({
            cell: this.field[i][j],
            x: i,
            y: j,
          });
      }
    }
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
