#!/bin/bash
# Produce REAL javac / java messages for the handbook. Never hand-write these.
cd "$(dirname "$0")/errs" || exit 1
emit() { name="$1"; shift; printf '%s' "$*" > "$name.java"; echo "### $name"; javac -nowarn "$name.java" 2>&1 | head -6; echo; }

emit A 'public class A { public static void main(String[] a){ int x = "5"; } }'
emit B 'public class B { public static void main(String[] a){ Scanner s = new Scanner(System.in); } }'
emit C 'public class C { public static void main(String[] a){ System.out.println(y); } }'
emit D 'public class D { public static void main(String[] a){ int n = 5 } }'
emit E 'public class E { public static void main(String[] a){ if (a.length = 1) {} } }'
emit F 'public class F { static int f(){ } public static void main(String[] a){} }'
emit G 'class G { void m(){} } public class Wrong { public static void main(String[] a){} }'
emit H 'public class H { public static void main(String[] a){ String s="x"; s.lenght(); } }'
emit I 'public class I { void go(){ int[] q = new int[2]; q[5]=1; } public static void main(String[] a){ new I().go(); } }'
emit J 'public class J { public static void main(String[] a){ int x = f(); } static void f(){} }'
