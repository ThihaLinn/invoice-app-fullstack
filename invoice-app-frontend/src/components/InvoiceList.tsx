import React, { useEffect, useState } from "react";
import { getInvoiceList, searchInvoice } from "../api/invoice";
import { Invoice } from "../types/Invoice";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const InvoiceList = () => {

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = invoices.slice(startIndex, endIndex);


  if (invoices.length == 0) {

  }

  useEffect(()=> {
    getInvoiceList().then(res => setInvoices(res.data)).catch(error => console.log(error))

  },[])

  const handlePageChange = (page: React.SetStateAction<number>) => {
    console.log(page)
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

        <div className="">

          <nav className="flex items-center gap-x-1 justify-center">
            <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)} className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
              <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span aria-hidden="true" className="sr-only">Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
              {pages.map((page) => (
                <button type="button" key={page} onClick={() => handlePageChange(page)} className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${currentPage == page  && 'bg-[#4B5563] text-white'}`} >{page}</button>
                
                
              ))}
            </div>
            <button type="button" disabled={currentPage >= pages.length} onClick={() => setCurrentPage(currentPage + 1)} className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
              <span aria-hidden="true" className="sr-only">Next</span>
              <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </nav>
        </div>

      </div>
    );
  };



  console.log(invoices)



  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    if(term){
      searchInvoice(term).then(res => setInvoices(res.data)).catch(error => console.log(error))
    }else {
          getInvoiceList().then(res => setInvoices(res.data)).catch(error => console.log(error))

    }



  }, 500);
  return (
    <div className="w-[85%] mx-auto mt-10">
      <div className="w-[100%]">
        <input
          onChange={(event) => handleSearch(event.target.value)}
          type="text"
          className="focus:border-none focus:ring-1 py-2 px-3 border-none w-full ring-1 ring-gray-500 focus:outline-none"
          placeholder=" Search with invoice number or casherNumber"
        />
        
      </div>

      <table className="min-w-full divide-y divide-gray-200 mt-5">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Invoice No</th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Date</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Casher Name</th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Township</th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Remark</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentData.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800">
                <Link to={`update-invoice/${invoice.invoiceId}`}>{invoice.invoiceId}</Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{invoice.date as unknown as string}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">{invoice.casherName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{invoice.township}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{invoice.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPaginationControls()}

    </div>
  );
};

export default InvoiceList;
