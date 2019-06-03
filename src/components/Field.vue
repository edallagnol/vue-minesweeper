<template>
  <table>
    <tr v-for="(row, rowIdx) in field" v-bind:key="rowIdx">
        <td v-for="(cell, columnIdx) in row" v-bind:key="columnIdx"
          v-bind:class="{
            unknown: !cell.known,
            exploded: cell.showMine(),
            flagged: cell.flagged
          }"
          v-on:click="setCellKnown(cell)"
          v-on:click.right.prevent="setCellFlagged(cell)">
          <span v-if="cell.known && cell.neighborHood">
            {{ cell.neighborHood }}
          </span>
        </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Cell } from './cell';


@Component
export default class Field extends Vue {
  private static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  @Prop({ default: 10 }) private size!: number;
  @Prop({ default: 10 }) private mines!: number;
  private field: Cell[][] = [];
  private initialized = false;
  private flagCount = 0;

  private created() {
    for (let x = 0; x !== this.size; x++) {
      this.field.push([]);
      for (let y = 0; y !== this.size; y++) {
        this.field[x].push(new Cell(x, y));
      }
    }
  }

  private initMines(firstCell: Cell) {
    if (this.initialized) { return; }

    this.initialized = true;

    for (let i = this.mines; i--; ) {
      let cell: Cell;
      do {
        const randomX = Field.getRandomInt(this.size);
        const randomY = Field.getRandomInt(this.size);
        cell = this.field[randomX][randomY];
      } while (cell === firstCell || cell.mine);

      cell.mine = true;
      this.addMineNeighbor(cell);
    }
  }

  private addMineNeighbor(cell: Cell) {
    this.neighborhood(cell).forEach((neighbor) => neighbor.neighborHood++);
  }

  private setCellKnown(cell: Cell) {
    this.initMines(cell);

    if (cell.known) {
      if (this.neighborhoodFlagCountMatch(cell)) {
        this.neighborhood(cell)
          .filter((neighbor) => !neighbor.known && !neighbor.flagged)
          .forEach((neighbor) => this.setCellKnown(neighbor));
      }
      return;
    }

    cell.known = true;

    if (!cell.mine && cell.neighborHood === 0) {
      this.neighborhood(cell)
        .filter((neighbor) => !neighbor.known)
        .forEach((neighbor) => this.setCellKnown(neighbor));
    }
  }

  private neighborhoodFlagCountMatch(cell: Cell) {
    let flagCount = 0;
    this.neighborhood(cell).forEach((neighbor) => flagCount += +neighbor.flagged);
    return flagCount === cell.neighborHood;
  }

  private setCellFlagged(cell: Cell) {
    if (!cell.known) {
      cell.flagged = !cell.flagged;
      this.flagCount += cell.flagged ? 1 : -1;
      this.emitRemainingBombs(this.remainingBombs());
    }
  }

  private neighborhood(cell: Cell): Cell[] {
    const neighborhood = [];

    for (let i = cell.x - 1; i <= cell.x + 1; i++) {
      for (let j = cell.y - 1; j <= cell.y + 1; j++) {
          if (i < 0 || i >= this.size || j < 0 || j >= this.size) { continue; }
          if (i === cell.x && j === cell.y) { continue; }

          neighborhood.push(this.field[i][j]);
      }
    }

    return neighborhood;
  }

  private remainingBombs() {
    return this.mines - this.flagCount;
  }

  @Emit('update:remainingBombs')
  private emitRemainingBombs(remainingBombs: number) {
    return this.remainingBombs();
  }

}
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 1px;
}

td {
  width: 18px;
  height: 18px;
  cursor: default;
  user-select: none;
}

.unknown {
  background-color: grey;
}

.exploded {
  background-color: red;
}

.flagged {
  background-color: orange;
}

</style>
