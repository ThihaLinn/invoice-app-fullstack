import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { downloadExcel, getInvoiceList, searchInvoice, vaildateExcel } from "../api/invoice";
import { Invoice, TruncateProps } from "../types/Invoice";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { formatDateString, generateExcel } from "../util/validation";
import { useDownloadExcel } from "react-export-table-to-excel";
import * as XLSX from 'xlsx';
import { json } from "stream/consumers";
import { join } from "path";
import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hook";
import { setClose, setOpen } from "../app/slice/alertSlice";



const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = invoices.slice(startIndex, endIndex);
  const tableref = useRef(null)
  const [jsonData,setJsonData] = useState<Invoice[]>();
  const dispatch = useAppDispatch()





  if (invoices.length == 0) {
  }

  useEffect(() => {
    getInvoiceList()
      .then((res) => setInvoices(res.data))
      .catch((error) => console.log(error));
  }, []);

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const renderPaginationControls = () => {
    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div>
        <div className="mt-3">
          <nav className="flex items-center gap-x-1 justify-center">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage (currentPage - 1)}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                className="flex-shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span aria-hidden="true" className="sr-only">
                Previous
              </span>
            </button>
            <div className="flex items-center gap-x-1">
              {pages.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${
                    currentPage == page && "bg-[#4B5563] text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={currentPage >= pages.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span aria-hidden="true" className="sr-only">
                Next
              </span>
              <svg
                className="flex-shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            <div
                  className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200  py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none font-bold   bg-gray-300 text-[#4B5563]`}
                >
                  {invoices.length}
                </div>
          </nav>
        </div>
      </div>
    );
  };


  const handleSearch = useDebouncedCallback((term) => {
    if (term) {
      searchInvoice(term)
        .then((res) => setInvoices(res.data))
        .catch((error) => console.log(error));
    } else {
      getInvoiceList()
        .then((res) => setInvoices(res.data))
        .catch((error) => console.log(error));
    }
    setCurrentPage(1)
  }, 500);

  const isValidDateFormat = (dateStr: any): boolean => {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormat.test(dateStr);
};
 





const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const input = event.target;
  if (!input.files || input.files.length === 0) {
    console.error('No file selected.');
    return;
  }

  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  vaildateExcel(formData)
  .then(response => {
    console.log('Response from server:', response.data);

    getInvoiceList()
      .then((res) => setInvoices(res.data))
      .catch((error) => console.log(error));

      dispatch(setOpen({
        color:"text-[#EEF7FF]",
        isOpen:true,
        message:"You imported invoices successfully"
      }))
      
      setTimeout(() => {
        dispatch(setClose())
      }, 4000);
  })
  .catch((error: AxiosError) => {
    //console.error('Error:', error.response?.data);
    dispatch(setOpen({
      color:"text-[#EEF7FF]",
      isOpen:true,
      message:`${error.response?.data}`
    }))
    
    setTimeout(() => {
      dispatch(setClose())
    }, 4000);
  });

  // Clear the file input after uploading
  input.value = '';
};




  const Truncate: React.FC<TruncateProps> = ({ text, maxLength }) => {
    if (text.length <= maxLength) {
      return <span>{text}</span>;
    }

    const truncatedText = text.substring(0, maxLength) + "...";

    return <span>{truncatedText}</span>;
  };
  

 

  return (
    <div className="md:w-[85%] w-[95%] mx-auto mt-5">
      <div className="w-[100%] flex justify-center gap-5">
        <input
          onChange={(event) => handleSearch(event.target.value)}
          type="text"
          className="focus:border-none focus:ring-1 py-2 px-3 border-none w-[60%] ring-1 ring-gray-500 focus:outline-none"
          placeholder=" Search with invoice number or casherNumber"
        />
        <button
        onClick={() => {
          generateExcel(invoices)
          dispatch(setOpen({
            color:"text-[#EEF7FF]",
            isOpen:true,
            message:"You exported invoices successfully"
          }))
          
          setTimeout(() => {
            dispatch(setClose())
          }, 4000);
        }}
          className="align-middle select-none font-sans font-bold text-center  transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-gray-200 shadow-md shadow-gray-900/10 hover:shadow-none hover:shadow-gray-900/20 hover:opacity-[0.85]  active:opacity-[0.85] active:shadow-none hover:text-white "
          type="button"
        >
           Export
          </button>
          <label
          htmlFor="input"
          className="align-middle select-none font-sans font-bold text-center  transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-gray-200 shadow-md shadow-gray-900/10 hover:shadow-none hover:shadow-gray-900/20 hover:opacity-[0.85]  active:opacity-[0.85] active:shadow-none hover:text-white "

        >
           Import
          </label>
          <input id="input" type="file" onChange={handleFileChange}  accept=".xlsx" hidden></input>
      </div>

      <div className="overflow-auto  overflow-y-hidden  rounded-lg shadows  w-[85%] mx-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-5 " ref={tableref}>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center font-bold  text-gray-500  w-[150px]"
              >
                Invoice No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-bold  text-gray-500  w-[200px]"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-bold  text-gray-500  w-[200px]"
              >
                Casher Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start font-bold  text-gray-500  w-[200px]" 
              >
                Township
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start font-bold  text-gray-500  w-[200px]"
              >
                Remark
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((invoice) => (
              <tr key={invoice.invoiceId}>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800 w-[150px]">
                  <Link to={`update-invoice/${invoice.invoiceId}`}>
                   {invoice.invoiceId}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-center text-sm text-gray-800 w-[200px]">
                {formatDateString(invoice.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 w-[200px]">
                  {invoice.casherName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-sm text-gray-800 w-[200px]">
                  {invoice.township}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 w-[200px]">
                  <Truncate text={invoice.remark} maxLength={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPaginationControls()}
    </div>
  );
};

export default InvoiceList;
