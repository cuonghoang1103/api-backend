// =========== DO NOT EDIT THE GIVEN CONTENT OF THIS FILE ============
class Drum {
  String tower;
  int sound,type;
  Drum() {
   }
  Drum(String xTower, int xSound, int xType){
    tower=xTower;sound=xSound; type=xType;
   }
  public String toString(){
    return("(" +tower+","+sound + "," + type + ")");
   }
 }
