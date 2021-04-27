//% weight=100 color=#0fbc11 icon="" block="モーター"
namespace L6470 {
    let l6470 :L6470_extend

    /**
     * モータードライバとの通信に必要な設定を行います
     */
    //% weight=999
    //% advanced=false
    //% block="モータードライバを初期化する %ssPin "
    export function Initialize(ssPin: DigitalPin):void{
        l6470 = new L6470()
        l6470.Initialize(ssPin, MicroSteps.S128)
    }

    /**
     * 最大速度を設定します
     * @param speed 移動速度
     */
    //% weight=900 block="最高速度を毎分 %rpm 回転に設定する"
    export function SetMaxSpeed(rpm: number): void{
        l6470.setMaxSpeed(rpm)
    }


    /**
     * 回転角度を指定して移動します
     * @param angle 移動角度
     */
    //% block="%angle °回転させる"
    export function MoveTo(angle: number):void{
        const dir = angle >= 0 ? Dir.CW : Dir.CCW
        l6470.move(dir, Math.abs(angle))
    }

    /**
     * 方向と角度を指定して、停止信号を送るまで回転させます
     * @param dir 回転方向
     * @param rpm 回転速度
     */
    //% block="%dir に毎分 %rpm で回転させる"
    export function Run(dir : Dir , rpm : number): void{
        l6470.run(dir, rpm)
    }

    /**
     * 原点に移動します
     */
    //% block="原点位置に戻る"
    export function GoHome(): void{
        l6470.goHome()
    }

    /**
     * 今の位置を原点に設定します
     */
    //% block="原点に設定する"
    export function setHome(): void{
        l6470.setHome()
    }

    /**
     * 回転を止めます
     */
    //% block="回転を止める"
    export function Stop():void{
        l6470.stop(StopMode.Soft, HoldMode.Hold)
    }

    /**
     * 励磁を解除します
     */
    //% block="力を抜く"  advanced=true
    export function Release():void{
        l6470.stop(StopMode.Soft, HoldMode.Release)
    }

    
    /**
     * パラメーターを設定します
     */
    //% block="%reg を %value に設定する" advanced=true
    export function setParameter(reg: L6470_RegisterCommands, value: number): void{
        l6470.setParam(reg, value)
    }

    /**
     * パラメーターを取得します
     */
    //% block="%reg を取得する" advanced=true
    export function getParameter(reg: L6470_RegisterCommands): number{
        return l6470.getParam(reg)
    }
}
