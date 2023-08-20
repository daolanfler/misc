interface IUnaryExpression {
    a: number;
}

abstract class UnaryExpression implements IUnaryExpression {
    readonly a: number;

    constructor(a: number) {
        this.a = a;
    }

    abstract eval(): number;
}

class UnaryMinusExpress extends UnaryExpression {
    eval(): number {
        return -this.a;
    }
}
