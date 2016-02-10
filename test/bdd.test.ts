///<reference path="../typings/tsd.d.ts"/>
///<reference path="../source/interfaces.d.ts"/>

var expect = chai.expect;

describe('BDD test example for MathDemo class \n', () => {

  before(function(){ /* invoked once before All tests */});
  after(function(){ /* invoked once after All tests */});
  beforeEach(function(){ /* invoked once before Each test */});
  afterEach(function(){ /* invoked once after Each tests */});

  it('should return the correct numeric value for PI \n', () => {
    var math : MathInterface = new MathDemo();
    expect(math.PI).to.equals(3.14159265359);
    expect(math.PI).to.be.a('number');
  });

  //...
});
