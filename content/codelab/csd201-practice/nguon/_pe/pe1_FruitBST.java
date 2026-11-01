
import java.io.RandomAccessFile;

public class FruitBST {

    class Node {
        Fruit info;
        Node left, right;

        Node(Fruit x) {
            info = x;
            left = right = null;
        }
    }

    Node root;

    public FruitBST() {
        root = null;
    }
    
    public void ftraverse(RandomAccessFile f, Node root) throws Exception {
        if(root == null){
            return;
        }
        this.ftraverse(f, root.left);
        f.writeBytes("(" + root.info.fruitId + "," + root.info.name + "," + root.info.quantity + "," + root.info.price + ")");
        this.ftraverse(f, root.right);
    }
    
    public void ftraverse(RandomAccessFile f) throws Exception {
        if (root == null) {
            f.writeBytes("Empty\r\n");
            return;
        }
        this.ftraverse(f, root);
    }

    public void insert(Fruit fruit) {
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)
        return;
        // -----------------------------------------------------
    }

    public int countInRange(String minId, String maxId) {
        int count = 0;
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)
        
        // -----------------------------------------------------
        return count;
    }
}