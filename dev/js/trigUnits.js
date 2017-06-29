export default class trigUnits{
  constructor(value){
    this.value = value;
  }

  rad(){
    return this.value;
  }

  grad(){
    return this.value / 200 * Math.PI;
  }

  deg(){
    return this.value / 180 * Math.PI;
  }

}
