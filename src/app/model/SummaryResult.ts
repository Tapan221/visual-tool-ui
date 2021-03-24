export class SummaryResult {
    id: number;
    visitId: string;
    datetime: string;
    v2: string;
    recommendedDose: string;
    lastDose: string;
    doseChange: string;
    weight: string;
    baselineBG: string;
    kp: string;
    error: string;
    errorDeri: string;
    medianFbg: string;
    adaptiveKp: string;
    p: string;
    d: string;
    pd: string;
    pdRound: string;
    adaptivePd: string;
    xcoordinates: number[] = [];
    ycoordinates: number[] = [];
    xcoordinatesFittedFpg: number[] = [];
    ycoordinatesFittedFpg: number[] = [];


}