type UITableData = Row[];

type UIStateData = {
    tableData: UITableData;
    startDate: Date;
}

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

type Message = {
  startDate?: string | null;
  endDate?: string | null;
  content: string;
};