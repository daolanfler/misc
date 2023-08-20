class Bike {
    ride(): void {
    //
    }
}

class SportsCar {
    drive(): void {
    //
    }
}

const myBike: Bike = new Bike();

myBike.ride();

// const myPretendSportsCar: SportsCar = myBike as unknown as SportsCar;
const myPretendSportsCar: SportsCar = <SportsCar><unknown>myBike; // type cast 

myPretendSportsCar.drive();


export class Either<TLeft, TRight> {
    private readonly value: TLeft | TRight;
    private readonly left: boolean;

    private constructor(value: TLeft | TRight, left: boolean) {
        this.value= value;
        this.left = left;
    }

    isLeft(): boolean {
        return this.left;
    }

    getLeft(): TLeft {
        if (!this.isLeft()) throw new Error();
        return this.value as TLeft;
    }

    isRight():boolean {
        return !this.left;
    }

    getRight(): TRight {
        if(!this.isRight()) throw new Error();
        return this.value as TRight;
    }

    static makeLeft<TLeft, TRight>(value: TLeft) {
        return new Either<TLeft, TRight>(value, true);
    }

    static makeRight<TLeft, TRight>(value: TRight) {
        return new Either<TLeft, TRight>(value, false);
    }
}