///<reference path="./interfaces.d.ts"/>

class MathDemo implements MathInterface{
  public PI : number;

  constructor() {
    this.PI = 3.14159265359;
  }
}

export { MathDemo };
