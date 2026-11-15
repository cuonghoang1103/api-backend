// The attacker's view: a checker that leaks "how many leading characters were right" lets backtracking prune.
public class RoRi {
    static int tries;

    // #region ro-ri
    static boolean safeCheck(String secret, String g) { tries++; return secret.equals(g); }

    static int leakyCheck(String secret, String g) {
        tries++;
        int k = 0;
        while (k < secret.length() && g.charAt(k) == secret.charAt(k)) k++;
        return k;
    }

    static String crackSafe(String secret, int len) {
        for (int x = 0; x < (int) Math.pow(10, len); x++) {
            String g = String.format("%0" + len + "d", x);
            if (safeCheck(secret, g)) return g;
        }
        return null;
    }

    static String crackLeaky(String secret, int len) {
        StringBuilder prefix = new StringBuilder();
        for (int pos = 0; pos < len; pos++) {
            for (int d = 0; d <= 9; d++) {
                StringBuilder guess = new StringBuilder(prefix).append(d);
                while (guess.length() < len) guess.append('0');
                if (leakyCheck(secret, guess.toString()) > pos) { prefix.append(d); break; }
            }
        }
        return prefix.toString();
    }

    // #endregion

    public static void main(String[] args) {
        for (String secret : new String[]{"000000", "481516", "999999"}) {
            tries = 0;
            String a = crackSafe(secret, 6);
            int safeTries = tries;
            tries = 0;
            String b = crackLeaky(secret, 6);
            System.out.println("secret " + secret + " | yes/no checker: found " + a + " after " + safeTries
                + " tries | leaky checker: found " + b + " after " + tries + " tries");
        }
    }
}
