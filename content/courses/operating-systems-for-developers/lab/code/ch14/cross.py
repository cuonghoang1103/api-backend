# cross.py — cùng câu hỏi, từ Python (Chương 14, bài 14.8). ntpath/posixpath = luật Windows/POSIX, chạy được ở mọi máy.
import os, sys, ntpath, posixpath
from pathlib import Path, PureWindowsPath, PurePosixPath
print("platform", sys.platform, "| os.sep", repr(os.sep), "| os.pathsep", repr(os.pathsep), "| os.linesep", repr(os.linesep))
print("os.path.join   ", os.path.join("src", "config", "app.json"))
print("ntpath.join    ", ntpath.join("src", "config", "app.json"))
print("posixpath.join ", posixpath.join("src", "config", "app.json"))
print("PureWindowsPath", PureWindowsPath("C:/Users/dev") / "app" / "a.txt", "| parts", PureWindowsPath("C:/Users/dev/a.txt").parts)
print("PurePosixPath  ", PurePosixPath("/home/dev") / "app" / "a.txt")
print("case: PureWindowsPath('A.TXT') == PureWindowsPath('a.txt') ->", PureWindowsPath("A.TXT") == PureWindowsPath("a.txt"),
      "| PurePosixPath ->", PurePosixPath("A.TXT") == PurePosixPath("a.txt"))
