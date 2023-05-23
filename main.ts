L6470.Initialize(DigitalPin.P16)
L6470.setHome()
L6470.SetMaxSpeed(60)
pins.setPull(DigitalPin.P6, PinPullMode.PullNone)
pins.setPull(DigitalPin.P7, PinPullMode.PullDown)
pins.setPull(DigitalPin.P8, PinPullMode.PullDown)
pins.setPull(DigitalPin.P9, PinPullMode.PullDown)
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P8) == 1) {
        L6470.Run(Dir.CW, 10)
        while (pins.digitalReadPin(DigitalPin.P8) == 1) {
            basic.pause(100)
        }
        L6470.Stop()
    }
})
