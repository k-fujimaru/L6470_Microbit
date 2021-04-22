pins.setPull(DigitalPin.P10, PinPullMode.PullNone)
pins.setPull(DigitalPin.P6, PinPullMode.PullDown)
pins.setPull(DigitalPin.P7, PinPullMode.PullDown)
L6470.Initialize(DigitalPin.P16)
L6470.setHome()
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        L6470.Run(Dir.CW, Speed.Mid)
        while (input.buttonIsPressed(Button.A)) {
            basic.pause(50)
        }
        L6470.Stop()
    } else if (input.buttonIsPressed(Button.B)) {
        L6470.Run(Dir.CCW, Speed.Mid)
        while (input.buttonIsPressed(Button.B)) {
            basic.pause(50)
        }
        L6470.Stop()
    }
    if (pins.digitalReadPin(DigitalPin.P10) == 0) {
        L6470.Run(Dir.CCW, Speed.Mid)
        while (pins.digitalReadPin(DigitalPin.P6) == 0) {
            basic.pause(50)
        }
        L6470.Run(Dir.CW, Speed.Mid)
        while (pins.digitalReadPin(DigitalPin.P7) == 0) {
            basic.pause(50)
        }
        L6470.Stop()
    }
})
