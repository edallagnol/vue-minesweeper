export class Cell {
    constructor(public x: number, public y: number) {};

    public mine = false;
    public known = false;
    public flagged = false;
    public neighborHood = 0;

    public showMine() {
        return this.mine && this.known;
    }
}
