namespace L6470 {
    export class L6470 {
        csPin: DigitalPin
        microStep: number
        stepOfLap: number

        constructor() {
            this.stepOfLap = 200 //1回転あたりのステップ数
        }

        Initialize(ss: DigitalPin, microStep: MicroSteps) {
            this.csPin = ss
            this.microStep = microStep
            //SPIの設定
            pins.digitalWritePin(this.csPin, 1)
            pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
            pins.spiFormat(8, 3)
            pins.spiFrequency(1000000)
            // ドライバの初期設定
            this.setParam(L6470_RegisterCommands.MAX_SPEED, 0x20) //最大回転スピード
            this.setParam(L6470_RegisterCommands.KVAL_HOLD, 0xFF) //モーター停止中の電圧設定
            this.setParam(L6470_RegisterCommands.KVAL_RUN, 0xFF) //モーター低速回転時の電圧設定
            this.setParam(L6470_RegisterCommands.KVAL_ACC, 0xFF) //モーター加速中の電圧設定
            this.setParam(L6470_RegisterCommands.KVAL_DEC, 0xFF) //モーター減速中の電圧設定
            this.setParam(L6470_RegisterCommands.OCD_TH, 0xF) //オーバーカレントの電流スレッショルド
            this.setParam(L6470_RegisterCommands.STALL_TH, 0x7F) //ストールの電流スレッショルド
            this.setParam(L6470_RegisterCommands.STEP_MODE, microStep) //マイクロステップの設定
        }



        //角度をマイクロステップに変換
        convertAngleToMicrostep(angle: number): number {
            const fullStep = (this.stepOfLap / (360 / angle))
            const microstep = fullStep * (2 ** this.microStep)

            return microstep
        }

        run(dir: Dir, rpm: number) {
            let command
            command = L6470_MotionCommands.Run
            command |= dir //末尾1桁で回転方向指定
            let speedReg: number
            speedReg = Math.round(rpm * this.stepOfLap * 67108 / 1000) // データシート記載の数式から近似値

            this.sendCommand(command, speedReg, 20)
        }

        move(dir: Dir, angle: number) {
            let command
            command = L6470_MotionCommands.Move
            command |= dir //末尾1桁で回転方向指定
            const microstep = this.convertAngleToMicrostep(angle)
            
            this.sendCommand(command, microstep, 22)
        }

        // 停止コマンド
        stop(stopMode: StopMode, holdMode: HoldMode) {
            let command = L6470_MotionCommands.Stop
            command += stopMode
            command += holdMode

            this.sendData(command)
        }

        goHome() {
            this.sendCommand(L6470_MotionCommands.GoHome, 0, 0)
        }

        setHome() {
            this.sendCommand(L6470_MotionCommands.ResetPos, 0, 0)
        }




        //L6470の設定レジスタに書き込む
        setParam(parameter: L6470_RegisterCommands, value: number) {
            const comm = parameter & 0x1f //000[レジスタアドレス]でsetParam
            const valueBitLength = this.getRegisterLength(parameter)
            this.sendCommand(comm, value, valueBitLength)
        }

        //L6470の設定レジスタを読み込む
        getParam(parameter: L6470_RegisterCommands): number {
            const comm = 0x20 | parameter & 0x1f //001[レジスタアドレス]でgetParam
            const value = 0x00 //データ読み出し時のValueは0
            const valueBitLength = this.getRegisterLength(parameter)
            const tmpParam = this.sendCommand(comm, value, valueBitLength)

            return tmpParam
        }
        
        //コマンドを送信する
        sendCommand(command: number, value: number, valueBitLength: number): number {
            let tmpParam: number = 0 //応答格納仮変数
            this.sendData(command) //コマンド部

            const valueByteLength = Math.floor((valueBitLength - 1) / 8) //送信ビット数は8ビット単位で切り上げ
            for (let i = valueByteLength; i >= 0; i--) {
                let sendByte = value >> (8 * i) //TODO 余剰となる上位ビットを0にする
                tmpParam += this.sendData(sendByte) //上位ビットから順に8bitずつ送信する
            }

            return tmpParam;
        }

        //下位0xff分をSPIで送信する
        private sendData(parameter: number): number {
            pins.digitalWritePin(this.csPin, 0)
            serial.writeLine("send:" + (parameter & 0xff))
            const returnValue = pins.spiWrite(parameter & 0xff)
            pins.digitalWritePin(this.csPin, 1)

            return returnValue
        }


        getRegisterLength(command: L6470_RegisterCommands): number {
            switch (command) {
                case L6470_RegisterCommands.ABS_POS:
                    return 22
                case L6470_RegisterCommands.EL_POS:
                    return 9
                case L6470_RegisterCommands.MARK:
                    return 22
                case L6470_RegisterCommands.SPEED:
                    return 20
                case L6470_RegisterCommands.ACC:
                    return 12
                case L6470_RegisterCommands.DEC:
                    return 12
                case L6470_RegisterCommands.MAX_SPEED:
                    return 10
                case L6470_RegisterCommands.MIN_SPEED:
                    return 13
                case L6470_RegisterCommands.KVAL_HOLD:
                case L6470_RegisterCommands.KVAL_RUN:
                case L6470_RegisterCommands.KVAL_ACC:
                case L6470_RegisterCommands.KVAL_DEC:
                    return 8
                case L6470_RegisterCommands.INT_SPD:
                    return 14
                case L6470_RegisterCommands.ST_SLP:
                case L6470_RegisterCommands.FN_SLP_ACC:
                case L6470_RegisterCommands.FN_SLP_DEC:
                    return 8
                case L6470_RegisterCommands.K_THERM:
                    return 4
                case L6470_RegisterCommands.ADC_OUT:
                    return 5
                case L6470_RegisterCommands.OCD_TH:
                    return 4
                case L6470_RegisterCommands.STALL_TH:
                    return 7
                case L6470_RegisterCommands.FS_SPD:
                    return 10
                case L6470_RegisterCommands.STEP_MODE:
                case L6470_RegisterCommands.ALARM_EN:
                    return 8
                case L6470_RegisterCommands.CONFIG:
                case L6470_RegisterCommands.STATUS:
                    return 16
                case L6470_RegisterCommands.STEP_MODE:
                    return 8
            }
            return 0;
        }
    }
}