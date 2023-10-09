classBuilder =  function (a, b, c) b.__type = a; if (not c) then error(("ExtendingNotDefined: " .. (a .. " tried to extend a class that is not defined")), 2) end; if c.__prototype then b.super = setmetatable({}, {__index =  function (self, d)  return c.__prototype[d]; end ,__call =  function (self, ...)  return c(...); end }); end;_G[a] = setmetatable({__type = a,__prototype = b}, {__call =  function (self, ...)  local e = setmetatable(self, {__index =  function (self, d)  if self.__prototype.super then  return (self.__prototype[d] or self.__prototype.super[d]); else  return self.__prototype[d]; end; end ,__gc =  function (self)  if self.destructor then self:destructor() end; end }); if e.constructor then e:constructor(...) end; return e; end }); end ;classBuilder("Dio", {
value = "dio",

destructor =  function (self) 
print("destructor", self.value)
 end 
}, {})

classBuilder("Test", {
value = "test",

constructor =  function (self, param) assert((type(param) == "string"), ("param: string expected, got " .. type(param)))
print("constructor", self.value)
print("param", param)
 end ,

destructor =  function (self) 
print("destructor", self.value)
 end 
}, Dio)

 local test = Test("test");