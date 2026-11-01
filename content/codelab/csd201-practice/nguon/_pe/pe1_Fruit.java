public class Fruit {
    String fruitId;
    String name;
    int quantity;
    double price;

    public Fruit(String fruitId, String name, int quantity, double price) {
        this.fruitId = fruitId;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    public String toString() {
        return "(" + fruitId + ", " + name + ", " + quantity + ", " + price + ")";
    }
}