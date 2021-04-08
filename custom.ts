enum Dir {
    //% block="CW"
    CW = 1,
    //% block="CCW"
    CCW
}

enum Speed{
    //% block="低速"
    Low = 1,
    //% block="中速"
    Mid,
    //% block="高速"
    High
}

//% weight=100 color=#0fbc11 icon="" block="モーター"
namespace L6740 {
    /**
     * 初期化
     */
    //% block="初期化する"
    export function Initialize():void{
        //SPIの設定
        pins.digitalWritePin(DigitalPin.P16, 1)
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
        pins.spiFormat(8, 3)
        pins.spiFrequency(1000000)
        //TODO ドライバの設定

    }

    /**
     * 速度設定
     * @param speed 移動速度
     */
    //% block="スピードを %speed に設定する"
    export function SetSpeed(speed: Speed):void{

    }

    /**
     * 移動
     * @param angle 移動角度
     */
    //% block="%angle °回転させる"
    export function Move(angle: number):void{

    }

    /**
     * 回転
     * @param dir 回転方向
     * @param speed 回転速度
     */
    //% block="%dir に %speed で回転させる"
    export function Run(dir : Dir , speed : Speed):void{

    }

    /**
     * 停止
     */
    //% block="回転を止める"
    export function Stop():void{

    }

    /**
     * 脱力
     */
    //% block="力を抜く"
    export function Release():void{

    }
    
}
