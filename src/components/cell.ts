export class Cell {
    public mine = false;
    public known = false;
    public flagged = false;
    public neighborhood = 0;

    constructor(public x: number, public y: number) {}

    public showMine() {
        return this.mine && this.known;
    }

    public showFlagged() {
        return this.flagged && !this.known;
    }

    public showNeighborHood() {
        return this.known && this.neighborhood && !this.mine;
    }
}
