enum Dir {
    //% block="正転"
    CW = 0,
    //% block="逆転"
    CCW = 1
}

enum Speed{
    //% block="低速"
    Low = 0x100,
    //% block="中速"
    Mid = 0x160,
    //% block="高速"
    High = 0x4000
}
//% weight=100 color=#0fbc11 icon="" block="モーター"
namespace L6470 {
    let l6470 :L6470

    /**
     * モータードライバとの通信に必要な設定を行います
     */
    //% weight=999
    //% block="モータードライバを初期化する %ssPin "
    export function Initialize(ssPin: DigitalPin):void{
        l6470 = new L6470()
        l6470.Initialize(ssPin, 7)
    }


    /**
     * 最大速度を設定します
     * @param speed 移動速度
     */
    //% weight=900 block="最高速度を %speed に設定する"
    export function SetSpeed(speed: Speed):void{

    }

    /**
     * 回転角度を指定して移動します
     * @param angle 移動角度
     */
    //% block="%angle °回転させる"
    export function Movea(angle: number):void{

    }

    /**
     * 方向と角度を指定して、停止信号を送るまで回転させます
     * @param dir 回転方向
     * @param speed 回転速度
     */
    //% block="%dir に %speed で回転させる"
    export function Run(dir : Dir , speed : Speed):void{
        l6470.run(dir, speed)
    }

    /**
     * 回転を止めます
     */
    //% block="回転を止める"
    export function Stop():void{

    }

    /**
     * 励磁を解除します
     */
    //% block="力を抜く"
    export function Release():void{
        
    }

    export class L6470{
        csPin: DigitalPin
        microStep: number

        Initialize(ss: DigitalPin, microStep: number){
            this.csPin = ss
            this.microStep = microStep
            //SPIの設定
            pins.digitalWritePin(this.csPin, 1)
            pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
            pins.spiFormat(8, 3)
            pins.spiFrequency(1000000)
            // ドライバの設定
            this.setParam(0x07, 0x20, 10) //最大回転スピード
            this.setParam(0x09, 0xFF, 8) //モーター停止中の電圧設定
            this.setParam(0x0A, 0xFF, 8) //モーター低速回転時の電圧設定
            this.setParam(0x0B, 0xFF, 8) //モーター加速中の電圧設定
            this.setParam(0x0C, 0xFF, 8) //モーター減速中の電圧設定
            this.setParam(0x13, 0xF, 4) //オーバーカレントの電流スレッショルド
            this.setParam(0x14, 0x7F, 7) //ストールの電流スレッショルド
            this.setParam(0x16, 0x7, 8) //マイクロステップの設定
        }

        // 回転
        run(direction: Dir, speed: Speed){
            let command
            command = 0x50
            command += direction //末尾1桁で回転方向指定

            let speedReg: number
            speedReg = speed //定数で定義している
            this.sendMotionCommand(command, speedReg)
        }

        // 動作系のコマンドを送信する
        sendMotionCommand(command: number, value: number){
            this.sendData(command)
            const byteLength = 3 //動作系コマンドは一律3バイト
            for(let i = byteLength - 1; i >= 0; i--){
                let sendByte = value >> (8 * i)
                this.sendData(sendByte) //上位ビットから順に8bitずつ送信する
            }
        }

        //L6470の設定レジスタに書き込む
        setParam(parameter: number, value: number, valueBitLength: number){
            this.sendData(parameter & 0x1f) //000[レジスタアドレス]でsetParam
            const byteLength = Math.floor((valueBitLength - 1) / 8) //送信ビット数は8ビット単位で切り上げ
            for(let i = byteLength; i >= 0; i--){
                let sendByte = value >> (8 * i)
                this.sendData(sendByte) //上位ビットから順に8bitずつ送信する
            }
        }
        
        //下位0xff分をSPIで送信する
        private sendData (parameter: number): number {
            pins.digitalWritePin(this.csPin, 0)
            serial.writeLine("send:" + (parameter & 0xff))
            const returnValue = pins.spiWrite(parameter & 0xff)
            pins.digitalWritePin(this.csPin, 1)

            return returnValue
        }
    }
}
