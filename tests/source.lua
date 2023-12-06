local tab = {test = 5, test2 = 10};

-- Key value tables
local a = {k, v*2 for k, v in pairs(tab)};

-- Array like tables (only 1 statement)
local b = {"element:"..k for k, v in pairs(tab)};

-- Just for check the results
for k,v in pairs(a) do
    print(k,v)
end

for k,v in pairs(b) do
    print(k,v)
end