import java.io.File;
import java.io.RandomAccessFile;

public class Assignment {
    ShipmentCLL shipment;
    FruitBST bst;
    String dataFile = "data.txt";

    public Assignment() {
        shipment = new ShipmentCLL();
        bst = new FruitBST();
    }

    public void loadDataShipment() {
        String[] ids = Lib.readLineToStrArray(dataFile, 1);
        String[] names = Lib.readLineToStrArray(dataFile, 2);
        int[] quantities = Lib.readLineToIntArray(dataFile, 3);
        double[] prices = Lib.readLineToDoubleArray(dataFile, 4);
        
        for (int i = 0; i < ids.length; i++) {
                shipment.addToShipment(new Fruit(ids[i], names[i], quantities[i], prices[i]));
        }
    }
    
    public void loadDataBST() {
        String[] ids = Lib.readLineToStrArray(dataFile, 1);
        String[] names = Lib.readLineToStrArray(dataFile, 2);
        int[] quantities = Lib.readLineToIntArray(dataFile, 3);
        double[] prices = Lib.readLineToDoubleArray(dataFile, 4);
        
        for (int i = 0; i < ids.length; i++) {
                bst.insert(new Fruit(ids[i], names[i], quantities[i], prices[i]));
        }
    }

    public void f1() throws Exception {
        String fname = "f1.txt";
        File f = new File(fname);
        if (f.exists()) f.delete();
        RandomAccessFile rf = new RandomAccessFile(fname, "rw");
        loadDataShipment();
        rf.writeBytes("Current Shipment:\r\n");
        shipment.ftraverse(rf);
        int count = shipment.countFruits();
        rf.writeBytes("\r\nCounted fruits: " + count + "\r\n");
        
        rf.close();
    }

    public void f2() throws Exception {
        String fname = "f2.txt";
        File f = new File(fname);
        if (f.exists()) f.delete();
        RandomAccessFile rf = new RandomAccessFile(fname, "rw");
        rf.writeBytes("Current Shipment:\r\n");
        loadDataShipment();
        shipment.ftraverse(rf);
        String removedId = Lib.readLineToStr(dataFile, 5);
        shipment.removeById(removedId);
        rf.writeBytes("\r\nShipment after removing " + removedId + ":\r\n");
        shipment.ftraverse(rf);
        rf.close();
    }
    
    public void f3() throws Exception {
        String fname = "f3.txt";
        File f = new File(fname);
        if (f.exists()) f.delete();
        RandomAccessFile rf = new RandomAccessFile(fname, "rw");
        rf.writeBytes("Current Fruits (Alphabetically Ordered by ID):\r\n");
        loadDataBST();
        bst.ftraverse(rf);
        rf.close();
    }
    
    public void f4() throws Exception {
        String fname = "f4.txt";
        File f = new File(fname);
        if (f.exists()) f.delete();
        RandomAccessFile rf = new RandomAccessFile(fname, "rw");
        rf.writeBytes("Current Fruits:\r\n");
        loadDataBST();
        bst.ftraverse(rf);
        
        String lower = Lib.readLineToStr(dataFile, 6);
        String upper = Lib.readLineToStr(dataFile, 7);
        rf.writeBytes("\r\nCounting fruits with fruitId in range [" + lower + "," + upper + "]:");
        int result = bst.countInRange(lower, upper);
        rf.writeBytes("\r\nResult: " + result);
        rf.close();
    }
}