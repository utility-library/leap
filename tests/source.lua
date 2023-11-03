function stopwatch(func)
    return function(...)
        local time = GetGameTimer()
        local data = func(...)
        local diffTime = GetGameTimer() - time

        print(func.name.." taken "..diffTime.."ms to execute")
        return data
    end
end

@stopwatch()
function someMathIntensiveFunction(a, b, pow)
    for i=1, 500000 do
        math.pow(a*b, pow)
    end

    return math.pow(a*b, pow)
end

someMathIntensiveFunction(10, 50, 100)