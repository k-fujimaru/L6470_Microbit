namespace L6470 {
    export class L6470 {
        csPin: DigitalPin

        initializeSPI(ss: DigitalPin) {
            this.csPin = ss
            pins.digitalWritePin(this.csPin, 1)
            pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
            pins.spiFormat(8, 3)
            pins.spiFrequency(1000000)
        }




        //L6470の設定レジスタに書き込む
        setParam(parameter: L6470_RegisterCommands, value: number) {
            const comm = 0x00 | parameter & 0x1f //000[レジスタアドレス]でsetParam
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
                let sendByte = (value >> (8 * i)) & 0xff
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