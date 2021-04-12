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

enum MicroSteps{
    FullStep = 0x0,
    HalfStep = 0x1,
    S4 = 0x2,
    S8 = 0x3,
    S16 = 0x4,
    S32 = 0x5,
    S64 = 0x6,
    S128 = 0x7,
}

enum L6470_Commands{
    ABS_POS,
    EL_POS,
    MARK,
    SPEED,
    ACC,
    DEC,
    MAX_SPEED,
    MIN_SPEED,
    KVAL_HOLD,
    KVAL_RUN,
    KVAL_ACC,
    KVAL_DEC,
    INT_SPD,
    ST_SLP,
    FN_SLP_ACC,
    FN_SLP_DEC,
    K_THERM,
    ADC_OUT,
    OCD_TH,
    STALL_TH,
    FS_SPD,
    STEP_MODE,
    ALARM_EN,
    CONFIG,
    STATUS,
    RESERVED1 = 0x1A,
    RESERVED2 = 0x1B,
}



//% weight=100 color=#0fbc11 icon="" block="モーター"
namespace L6470 {
    let l6470 :L6470

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

        Initialize(ss: DigitalPin, microStep: MicroSteps){
            this.csPin = ss
            this.microStep = microStep
            //SPIの設定
            pins.digitalWritePin(this.csPin, 1)
            pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
            pins.spiFormat(8, 3)
            pins.spiFrequency(1000000)
            // ドライバの初期設定
            this.setParam(L6470_Commands.MAX_SPEED, 0x20) //最大回転スピード
            this.setParam(L6470_Commands.KVAL_HOLD, 0xFF) //モーター停止中の電圧設定
            this.setParam(L6470_Commands.KVAL_RUN, 0xFF) //モーター低速回転時の電圧設定
            this.setParam(L6470_Commands.KVAL_ACC, 0xFF) //モーター加速中の電圧設定
            this.setParam(L6470_Commands.KVAL_DEC, 0xFF) //モーター減速中の電圧設定
            this.setParam(L6470_Commands.OCD_TH, 0xF) //オーバーカレントの電流スレッショルド
            this.setParam(L6470_Commands.STALL_TH, 0x7F) //ストールの電流スレッショルド
            this.setParam(L6470_Commands.STEP_MODE, microStep) //マイクロステップの設定
        }

        getRegisterLength(command: L6470_Commands): number{
            switch(command){
                case L6470_Commands.ABS_POS:
                    return 22
                case L6470_Commands.EL_POS:
                    return 9
                case L6470_Commands.MARK:
                    return 22
                case L6470_Commands.SPEED:
                    return 20
                case L6470_Commands.ACC:
                    return 12
                case L6470_Commands.DEC:
                    return 12
                case L6470_Commands.MAX_SPEED:
                    return 10
                case L6470_Commands.MIN_SPEED:
                    return 13
                case L6470_Commands.KVAL_HOLD :
                case L6470_Commands.KVAL_RUN :
                case L6470_Commands.KVAL_ACC :
                case L6470_Commands.KVAL_DEC :
                    return 8
                case L6470_Commands.INT_SPD :
                    return 14
                case L6470_Commands.ST_SLP :
                case L6470_Commands.FN_SLP_ACC :
                case L6470_Commands.FN_SLP_DEC :
                    return 8
                case L6470_Commands.K_THERM :
                    return 4
                case L6470_Commands.ADC_OUT :
                    return 5
                case L6470_Commands.OCD_TH :
                    return 4
                case L6470_Commands.STALL_TH :
                    return 7
                case L6470_Commands.FS_SPD :
                    return 10
                case L6470_Commands.STEP_MODE :
                case L6470_Commands.ALARM_EN :
                    return 8
                case L6470_Commands.CONFIG :
                case L6470_Commands.STATUS :
                    return 16
                case L6470_Commands.STEP_MODE :
                    return 8
            }
            return 0;
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
        setParam(parameter: L6470_Commands, value: number){
            const valueBitLength = this.getRegisterLength(parameter)

            this.sendData(parameter & 0x1f) //000[レジスタアドレス]でsetParam
            const valueByteLength = Math.floor((valueBitLength - 1) / 8) //送信ビット数は8ビット単位で切り上げ
            for(let i = valueByteLength; i >= 0; i--){
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
