-- Table in (with key)

local a = {
    {
        id = 1
    },
    {
        id = 2
    },
    {
        id = 3
    }
}

if 2 in a.id then
    print("2 in a")
end

-- Array in

local b = {1, 2, 3, 4, 5}

if 2 in b then
    print("2 in b")
end

-- String in

local c = "hello"

if "hel" in c then
    print("c contains the string hel")
end