namespace L6470 {
    export class L6470_extend extends L6470 {
        microStep: number
        stepOfLap: number
        

        Initialize(ss: DigitalPin, microStep: MicroSteps) {
            //SPIの初期化
            this.initializeSPI(ss)

            //ステップ制御の設定
            this.microStep = microStep
            this.stepOfLap = 200 //1回転あたりのステップ数

            //ドライバの初期化
            this.deviceReset()

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


        setMaxSpeed(rpm : number) {
            const rps = rpm / 60
            const speedReg = Math.round(rps * this.stepOfLap * 65536 / 1000 / 1000) // データシート記載の数式から近似値
            this.setParam(L6470_RegisterCommands.MAX_SPEED, speedReg)
        }

        
        convertAngleToMicrostep(angle: number): number {
            const fullStep = (this.stepOfLap / (360 / angle))
            const microstep = fullStep * (2 ** this.microStep)

            return microstep
        }

        run(dir: Dir, rpm: number) {
            let command
            command = L6470_MotionCommands.Run
            command |= dir //末尾1桁で回転方向指定
            const rps = rpm / 60

            let speedReg: number
            speedReg = Math.round(rps * this.stepOfLap * 67108 / 1000) // データシート記載の数式から近似値

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

            this.sendCommand(command, 0, 0)
        }

        goHome() {
            this.sendCommand(L6470_MotionCommands.GoHome, 0, 0)
        }

        setHome() {
            this.sendCommand(L6470_MotionCommands.ResetPos, 0, 0)
        }

        deviceReset() {
            this.sendCommand(L6470_MotionCommands.NOP, 0, 0)
            this.sendCommand(L6470_MotionCommands.ResetDevice, 0, 0)
        }
    }
}