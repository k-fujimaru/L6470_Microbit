L6470.Initialize(DigitalPin.P16)
basic.forever(function () {
    L6470.Run(Dir.CW, Speed.High)
    basic.pause(1000)
    L6470.Run(Dir.CCW, Speed.High)
    basic.pause(1000)
})
