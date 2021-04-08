function l6470_send (parm: number) {
    pins.digitalWritePin(DigitalPin.P16, 0)
    cmd = pins.spiWrite(parm)
    pins.digitalWritePin(DigitalPin.P16, 1)
}
let cmd = 0
L6740.Initialize()
