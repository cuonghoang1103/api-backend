#!/bin/sh
# gjf.sh <đối số google-java-format> — chạy google-java-format 1.27.0 bằng jar thường (cần guava). Bài 8.1/8.2.
# Lấy jar: mvn dependency:copy -Dartifact=com.google.googlejavaformat:google-java-format:1.27.0 (+ com.google.guava:guava:33.4.0-jre)
J=${GJF_JAR:-google-java-format-1.27.0.jar}; G=${GUAVA_JAR:-guava-33.4.0-jre.jar}
exec java --add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED \
  --add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED \
  --add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED --add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED \
  -cp "$J:$G" com.google.googlejavaformat.java.Main "$@"
