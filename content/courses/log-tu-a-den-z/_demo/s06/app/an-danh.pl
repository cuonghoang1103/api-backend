#!/usr/bin/perl
# an-danh.pl — làm sạch output chạy thật của Ch6 TRƯỚC khi vào bài: tên máy, tài khoản, home, UUID, IP, MAC, email.
# Không chứa tên thật: mọi giá trị thật đọc từ môi trường lúc chạy (HOME, USER, LAB, TEN_MAY, TEN_HIEN).
use strict; use warnings; use utf8;
binmode(STDIN, ':utf8'); binmode(STDOUT, ':utf8');
my ($home, $user, $lab, $may, $hien) = map { my $v = $ENV{$_} // ''; utf8::decode($v); $v } qw(HOME USER LAB TEN_MAY TEN_HIEN);
my (%uuid, %ip, %mac); my ($nu, $ni, $nm) = (0, 0, 0);
while (my $s = <STDIN>) {
  if ($lab ne '') { (my $l2 = $lab) =~ s{^/private}{}; $s =~ s{\Q$lab\E}{/private/tmp/loglab}g; $s =~ s{\Q$l2\E}{/tmp/loglab}g; }
  $s =~ s{(?:/private)?/tmp/claude-[0-9]+/[^\s'"]*}{/private/tmp/loglab}g;   # thư mục tạm dài của phiên (kể cả khi bị cut cắt cụt)
  $s =~ s{\Q$home\E}{/Users/sv}g if $home ne '';
  $s =~ s{\Q$hien\E}{MacBook Lab}g if $hien ne '';
  $s =~ s{\Q$may\E}{macbook-lab}gi if $may ne '';
  if ($user ne '') {
    $s =~ s{^\Q$user\E(\s)}{"sv" . (" " x (length($user) - 2)) . $1}e;   # cột đầu của `last`
    $s =~ s{\((\Q$user\E)\)}{(sv)}g; $s =~ s{\buser[ =:]+\Q$user\E\b}{user sv}gi;
  }
  $s =~ s{\b([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})\b}{ $uuid{uc $1} //= sprintf('00000000-0000-4000-8000-%012d', ++$nu) }ge;
  $s =~ s{\b((?:[0-9a-f]{2}:){5}[0-9a-f]{2})\b}{ $mac{lc $1} //= sprintf('02:00:00:00:00:%02d', ++$nm) }gie;
  $s =~ s{(?<![\d.])((?:\d{1,3}\.){3}\d{1,3})(?![\d.])}{ (($1 =~ /^(127\.|0\.0\.0\.0|255\.)/) || grep({ $_ > 255 } split(/\./, $1))) ? $1 : ($ip{$1} //= '192.0.2.' . (10 + ++$ni)) }ge;
  $s =~ s{\b[\w.+-]+@(?!example\.com\b)[\w-]+(?:\.[\w-]+)+\b}{sv\@example.com}g;
  $s =~ s{com\.apple\.launchd\.[A-Za-z0-9]{8,}}{com.apple.launchd.XXXXXXXXXX}g;
  print $s;
}
