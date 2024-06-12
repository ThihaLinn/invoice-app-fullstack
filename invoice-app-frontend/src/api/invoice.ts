import axios from "axios";
import { Invoice } from "../types/Invoice";
import { ListFormat } from "typescript";

const BASE_URL = "http://localhost:8080/invoice"

const DonwnloadUrl = "http://localhost:8080/invoiceDetail/download/excel"

const vALIDATEEXCEL = "http://localhost:8080/invoiceDetail/validate-excel"


export const getInvoiceList = () => axios.get(BASE_URL)

export const searchInvoice = (search:string) => axios.get(BASE_URL+`/search/${search}`)

export const getInvoice = (id:number) => axios.get(BASE_URL+`/${id}`)

export const createInvoice = (invoiceCreateRequest:Invoice) => axios.post(BASE_URL+"/createInvoice",invoiceCreateRequest)

export const editInvoice = (invoiceUpdateRequest:Invoice) => axios.post(BASE_URL+"/updateInvoice",invoiceUpdateRequest)

export const deleteInvoice = (id:number) => axios.delete(BASE_URL+`/${id}`)

export const downloadExcel  = (invoices:Array<Invoice>) => axios.post(DonwnloadUrl,invoices, {
    responseType: 'blob',
  })

export const vaildateExcel = async (file:any) => axios.post(vALIDATEEXCEL,file, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})