type Language = {
    lang: string;
    verified: boolean;
    dir: "ltr" | "rtl";
}

type Row = {
    dose: number;
    daysForDose: number;
}

type Template = Row