declare const NsType: unique symbol;

class Ns {
    readonly value: number;

    // corresponding tsconfig: strictPropertyInitialization 
    [NsType]: void;

    constructor(value: number) {
        this.value = value;
    }
}

// 由于 TypeScript 是 structral type system，`unique symbole`是用来模拟 nominal type system 的
declare const LbfsType: unique symbol;

class Lbfs {
    readonly value: number;
    [LbfsType]: void;
    constructor(value: number) {
        this.value = value;
    }
}

function lbfsToNs(lbfs: Lbfs): Ns {
    return new Ns(lbfs.value * 4.448222);
}

function trajectoryCorrection(momentum: Ns) {
    if (momentum.value < new Ns(2).value) {
    // 
    }
}

function provideMomentum() {
    // trajectoryCorrection(new Lbfs(1.5))
    trajectoryCorrection(lbfsToNs(new Lbfs(1.5)));
}

// 当我们依赖基本类型来表示所有内容时，就会出现基本类型偏执，例如使用 number 表示邮编，使用 string 表示电话号码等等。