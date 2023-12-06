 local tab = {test = 5,test2 = 10};


 local a = ( function ()  local a = {}; for k,v in pairs(tab) do a[k] = (v * 2); end; return a; end)();


 local b = ( function ()  local a = {}; for k,v in pairs(tab) do table.insert(a, ("element:" .. k)) end; return a; end)();


 for k,v in pairs(a) do 
print(k, v)
 end;

 for k,v in pairs(b) do 
print(k, v)
 end;