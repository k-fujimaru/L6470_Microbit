namespace L6470 {
    export class L6470_extend extends L6470 {

        setMaxSpeed(rpm : number) {
            const speedReg = Math.round(rpm * this.stepOfLap * 65536 / 1000 / 1000) // データシート記載の数式から近似値
            this.setParam(L6470_RegisterCommands.MAX_SPEED, speedReg)
        }
        
    }
}