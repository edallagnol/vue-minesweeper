<template>
  <!-- preventDefault right-click on table borders -->
  <table v-on:click.right.prevent>
    <tr v-for="(row, rowIdx) in field" v-bind:key="rowIdx">
        <td v-for="(cell, columnIdx) in row" v-bind:key="columnIdx"
          v-bind:class="{
            unknown: !cell.known,
            exploded: cell.showMine(),
            flagged: cell.showFlagged()
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
import MathUtils from '@/utils/math-utils';
import { Cell } from './cell';
import { format } from 'date-fns';


@Component
export default class Field extends Vue {
  @Prop({ default: 10 }) private size!: number;
  @Prop({ default: 10 }) private mines!: number;
  private field: Cell[][] = [];
  private initialized = false;
  private finished = false;
  private flagCount = 0;

  private created() {
    this.createEmptyCells();
  }

  private createEmptyCells() {
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
        cell = this.getRandomCell();
      } while (cell === firstCell || cell.mine);

      cell.mine = true;
      this.updateMineNeighborhood(cell);
    }
  }

  private getRandomCell() {
    const randomX = MathUtils.getRandomInt(this.size);
    const randomY = MathUtils.getRandomInt(this.size);
    return this.field[randomX][randomY];
  }

  private updateMineNeighborhood(cell: Cell) {
    this.neighborhood(cell).forEach((neighbor) => neighbor.neighborHood++);
  }

  private setCellKnown(cell: Cell) {
    this.initMines(cell);
    if (this.finished) {
      return;
    }

    if (cell.known) {
      if (this.neighborhoodFlagCountMatches(cell)) {
        this.neighborhood(cell)
          .filter((neighbor) => !neighbor.known && !neighbor.flagged)
          .forEach((neighbor) => this.setCellKnown(neighbor));
      }
      return;
    }

    cell.known = true;

    if (this.checkFinished(cell)) {
      return;
    }

    if (!cell.mine && cell.neighborHood === 0) {
      this.neighborhood(cell)
        .filter((neighbor) => !neighbor.known)
        .forEach((neighbor) => this.setCellKnown(neighbor));
    }
  }

  private checkFinished(cellClicked: Cell): boolean {
    if (cellClicked.mine) {
      this.finish(false);
      return true;
    }

    if (this.allNonBombsKnown()) {
      this.finish(true);
      return true;
    }

    return false;
  }

  private allNonBombsKnown() {
    for (const row of this.field) {
      for (const cell of row) {
        if (!cell.mine && !cell.known) {
          return false;
        }
      }
    }
    return true;
  }

  @Emit('finish')
  private finish(won: boolean) {
    this.finished = true;
    return won;
  }

  private neighborhoodFlagCountMatches(cell: Cell) {
    const flagCount = this.neighborhood(cell)
      .reduce((count, neighbor) => count + Number(neighbor.flagged), 0);
    return flagCount === cell.neighborHood;
  }

  private setCellFlagged(cell: Cell) {
    if (this.finished) {
      return;
    }

    if (!cell.known) {
      cell.flagged = !cell.flagged;
      this.flagCount += cell.flagged ? 1 : -1;
      this.emitRemainingBombs();
    }
  }

  private neighborhood(cell: Cell): Cell[] {
    const neighborhood = [];

    const minX = Math.max(cell.x - 1, 0);
    const minY = Math.max(cell.y - 1, 0);
    const maxX = Math.min(cell.x + 1, this.size - 1);
    const maxY = Math.min(cell.y + 1, this.size - 1);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
          if (x === cell.x && y === cell.y) { continue; }

          neighborhood.push(this.field[x][y]);
      }
    }

    return neighborhood;
  }

  @Emit('update:remainingBombs')
  private emitRemainingBombs() {
    return this.mines - this.flagCount;
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
