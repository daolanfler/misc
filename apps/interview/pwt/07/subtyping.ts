declare const TriangleType: unique symbol;

class Triangle {
    [TriangleType]: void;
}

declare const SquareType: unique symbol;

class Square {
    [SquareType]: void;
}

declare const CircleType: unique symbol;
class Circle {
    [CircleType]: void;
}

declare const EqualateralTriangleType: unique symbol;
class EqualateralTriangle extends Triangle {
    [EqualateralTriangleType]: void;
}

declare function makeShape(): Triangle | Square;

declare function draw(shape: Triangle | Square | Circle): void;

draw(makeShape());

declare function makeShape2(): EqualateralTriangle | Square;
draw(makeShape2());

declare function draw2(shape: EqualateralTriangle | Square | Circle): void
draw2(makeShape());