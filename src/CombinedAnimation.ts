export class CombinedAnimation {
    private start = 0;
    private end = 0
    private currentCoeff = 0;

    public getStart(): number {
        return this.start;
    }

    public getEnd(): number {
        return this.end;
    }

    public getFramesCount(): number {
        return this.frames;
    }

    public getCurrentCoeff(): number {
        return this.currentCoeff;
    }

    constructor(private frames: number) { }

    protected clamp(i: number, low: number, high: number): number {
        return Math.max(Math.min(i, high), low);
    }

    public animate(coeff: number): void {
        const clampedCoeff = this.clamp(coeff, 0.0, 1.0);

        this.start = Math.trunc(clampedCoeff * (this.frames - 1));
        if (this.start == this.frames - 1)
            this.start = this.frames - 2;
        this.end = this.start + 1;
        this.currentCoeff = (clampedCoeff * (this.frames - 1)) - this.start;
    }
}
