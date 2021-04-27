enum Dir {
    //% block="正転"
    CW = 0,
    //% block="逆転"
    CCW = 1
}

enum StopMode{
    Soft = 0x0,
    Hard = 0x8
}

enum HoldMode{
    Hold = 0x10,
    Release = 0x00 
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

enum L6470_MotionCommands{
    NOP = 0x00,
    Run = 0x50,
    StepClock = 0x58,
    Move = 0x40,
    GoTo = 0x60,
    GoTo_DIR = 0x68,
    GoUntil = 0x82,
    ReleaseSW = 0x92,
    GoHome = 0x70,
    GoMark = 0x78,
    ResetPos = 0xD8,
    ResetDevice = 0xC0,
    Stop = 0xA0,
    SoftStop = 0xB0,
    HardStop = 0xB8,
    SoftHiZ = 0xA0,
    GetStatus = 0xD0,
}

enum L6470_RegisterCommands{
    ABS_POS = 0x01,
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