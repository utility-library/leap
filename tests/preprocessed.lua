leap_table_match =  function (a, b)  local c = 0; local d = 0; for e,f in pairs(b) do c = (c + 1); repeat  if f.__exists then  if a[e] then d = (d + 1); end;break; end; if f.__type then  if (type(a[e]) == f.__type) then d = (d + 1); end;break; end; if f.__match then  if ((type(a[e]) == "string") and a[e]:match(f.__match)) then d = (d + 1); end;break; end; if (type(f) == "table") then  for g,h in pairs(a) do  if ((type(h) == "table") and leap_table_match(f, h)) then d = (d + 1);break; end; end; else  for g,h in pairs(a) do  if (f == h) then d = (d + 1);break; end; end; end; until true end; return (d == c); end ;leap_in =  function (b, i, j)  local k = type(i); if (k == "table") then  if (type(b) == "table") then  return leap_table_match(i, b); else  for l,m in pairs(i) do  local n = ((j and m[j]) or m); if (n == b) then  return true; end; end; end; elseif (k == "string") then  return i:find(b); else error(("in operator: unsupported type " .. k)) end; return false; end ; local a = {
{
id = 1
},
{
id = 2
},
{
id = 3
}
};

 if leap_in(2, a, "id") then 
print("2 in a")
 end;