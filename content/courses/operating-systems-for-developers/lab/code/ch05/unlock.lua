-- unlock.lua — chỉ xoá khoá nếu nó VẪN là của mình (so token), trong MỘT bước nguyên tử phía Redis.
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
