-- fenced-write.lua — "kho dữ liệu" chỉ nhận lệnh ghi mang fencing token MỚI HƠN token lớn nhất từng thấy.
local last = tonumber(redis.call('GET', KEYS[1] .. ':fence') or '0')
if tonumber(ARGV[1]) <= last then
  return 'REJECTED: token ' .. ARGV[1] .. ' <= ' .. last
end
redis.call('SET', KEYS[1] .. ':fence', ARGV[1])
redis.call('SET', KEYS[1], ARGV[2])
return 'OK: written by token ' .. ARGV[1]
