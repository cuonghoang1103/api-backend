import java.util.*;

public class TanSuat {
    // #region dup
    static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;   // add() returns false if x was already there
        }
        return false;
    }
    // #endregion

    // #region anagram
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("containsDuplicate([1,2,3,1]) = " + containsDuplicate(new int[]{1, 2, 3, 1}));
        System.out.println("containsDuplicate([1,2,3,4]) = " + containsDuplicate(new int[]{1, 2, 3, 4}));
        System.out.println("isAnagram(\"anagram\",\"nagaram\") = " + isAnagram("anagram", "nagaram"));
        System.out.println("isAnagram(\"rat\",\"car\") = " + isAnagram("rat", "car"));
    }
}
