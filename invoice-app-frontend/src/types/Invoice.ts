import { InvoiceDetail } from "./InvoiceDetail"

export interface Invoice  {
    invoiceId?:number
    casherName:string
    township:string
    date:string
    remark:string
    invoiceDetailDtos:Array<InvoiceDetail>
}

export const township: string[] = [
    "AHLONE", "BAHAN", "DAGON", "DAGON_SEIKKAN", "DAWBON", "DALA", "EAST_DAGON",
    "HLAING", "HLAINGTHAYA", "INSEIN", "KAMAYUT", "KYAUKTADA", "KYIMYINDAING", "LANMADAW",
    "LATHA", "MAYANGON", "MINGALA_TAUNGNYUNT", "MINGALADON", "NORTH_DAGON", "NORTH_OKKALAPA",
    "PAZUNDAUNG", "PABEDAN", "SANCHAUNG", "SEIKKAN", "SOUTH_DAGON", "SOUTH_OKKALAPA",
    "TAMWE", "THAKETA", "THINGANGYUN", "YANKIN"
];