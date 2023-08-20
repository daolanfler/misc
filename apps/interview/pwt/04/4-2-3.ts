declare const percentageType: unique symbol;

class Percentage {
    [percentageType]: void;
    value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static makePercentage(value: number): Percentage {
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }

        return new Percentage(value);
    }
}