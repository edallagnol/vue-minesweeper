export class Cell {
    public mine = false;
    public known = false;
    public flagged = false;
    public neighborHood = 0;

    public showMine() {
        return this.mine && this.known;
    }
}
