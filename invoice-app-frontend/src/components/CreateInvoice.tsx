import React, { useState } from "react";
import { Invoice, township } from "../types/Invoice";
import { InvoiceDetail } from "../types/InvoiceDetail";
import { createInvoice } from "../api/invoice";
import { Link, useNavigate } from "react-router-dom";
import {
  getFormattedDate,
  invoiceSchema,
  numberWithCommas,
} from "../util/validation";
import AlertBox from "./AlertBox";
import { useAppDispatch } from "../app/hook";
import { setClose, setOpen } from "../app/slice/alertSlice";
import { set } from "date-fns";

const CreateInvoice = () => {
  let currentDate = new Date();

  const navigate = useNavigate();

  const [value, setValue] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number[]>();
  const dispatch = useAppDispatch();

  let [invoice, setInvoice] = useState<Invoice>({
    invoiceId: 0,
    casherName: "",
    township: township[2],
    date:getFormattedDate(),
    remark: "",
    invoiceDetailDtos: [
      {
        id: 1,
        item: "",
        price: 0,
        quantity: 1,
        setAmount: 0,
      },
    ],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (invoice: Invoice) => {
    const result = invoiceSchema.safeParse(invoice);
    if (!result.success) {
      const validationErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join(".");
        validationErrors[path] = error.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
  };

  const add = () => {
    console.log(invoice);
    //setDate([...data, { id: value + 1, item: "", price: 0, amount: 1, totalAmount: 0 }])
    setValue(value + 1);
    setInvoice({
      ...invoice,
      invoiceDetailDtos: [
        ...invoice.invoiceDetailDtos,
        { id: value + 1, item: "", price: 0, quantity: 1, setAmount: 0 },
      ],
    });
  };

  const remove = (index: number | undefined) => {
    console.log(index);

    let details = invoice.invoiceDetailDtos.filter((_, i) => i !== index);

    //let rDetail = invoice.invoiceDetailDtos.find(ivd => ivd.id === id)

    setInvoice({ ...invoice, invoiceDetailDtos: details });
  };

  const changeItem = (item: string, id: number | undefined) => {
    console.log(item, id);
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.item = item;

    const newInvoiceDetail = invoice.invoiceDetailDtos.map((idd) =>
      idd.id === result.id ? result : idd
    );
    setInvoice({ ...invoice, invoiceDetailDtos: newInvoiceDetail });

    console.log(result);
    console.log(invoice);
  };

  const changePrice = (price: number, id: number | undefined) => {
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.price = price;
    result.setAmount = result.quantity * result.price;
    const final = invoice.invoiceDetailDtos.map((data) =>
      data.id == result.id ? result : data
    );
    setInvoice({ ...invoice, invoiceDetailDtos: final });
  };
  const changeQuantity = (quantity: number, id: number | undefined) => {
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.quantity = quantity;
    result.setAmount = result.quantity * result.price;
    const final = invoice.invoiceDetailDtos.map((data) =>
      data.id == result.id ? result : data
    );
    setInvoice({ ...invoice, invoiceDetailDtos: final });
  };

  function formatDateToDDMMYYYY(dateString: string) {
    try {
      // Parse the date string using a regular expression (more flexible)
      const regex = /(\d{4})-(\d{2})-(\d{2})/;
      const match = dateString.match(regex);
  
      if (match) {
        // Extract year, month, and day from matched groups
        const year = match[1];
        const month = match[2].padStart(2, '0'); // Ensure two-digit month
        const day = match[3].padStart(2, '0'); // Ensure two-digit day
  
        // Reconstruct the date in dd/MM/YYYY format
        return `${day}/${month}/${year}`;
      } else {
        // Handle invalid date format gracefully (optional)
        console.error("Invalid date format:", dateString);
        return null; // Or return a default value (e.g., "Invalid Date")
      }
    } catch (error) {
      // Handle other potential errors during parsing
      console.error("Error formatting date:", error);
      return null; // Or return a default value
    }
  }

  
  const saveInvoice = async () => {
    console.log(invoice)

    validate(invoice);
    const result = invoiceSchema.safeParse(invoice);
    if (result.success) {
      try {
        console.log(invoice)
        createInvoice(invoice);
        dispatch(
          setOpen({
            color: "text-[#EEF7FF]",
            isOpen: true,
            message: "You created invoice successfully",
          })
        );

        navigate("/");

        //window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const total = () => {
    let value = 0;

    const a = invoice.invoiceDetailDtos.map((detail) => {
      value += detail.price * detail.quantity;
    });

    return value;
  };

  console.log(errors);
  console.log(invoice);

  return (
    <div className="w-[80%] mx-auto mt-3 md:px-10 px-5  mb-1">
      <form action="">
        <div>
          <fieldset className="border-2 border-gray-400 rounded-sm md:px-2 pb-3 ">
            <legend className="font-semibold ms-4  px-3">Invoice</legend>

            <div className="grid xl:grid-cols-3 md:grid-cols-2  xl:gap-10 md:gap-5  h-fit  w-[100%] ">
              <div className="flex flex-col justify-evenly  h-24">
                <div className="w-[80%] mx-auto flex flex-col justify-evenly h-28 relative sm-mb-5 md:mb-0 sm:mb-0">
                  <div>Casher Name</div>
                  <input
                    onChange={(event) => {
                      setInvoice({
                        ...invoice,
                        casherName: event.target.value,
                      });
                      console.log(invoice);
                    }}
                    min={1}
                    className=" focus:border-none  focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-[100%]    "
                    placeholder="casher number"
                  />
                  {errors["casherName"] && (
                    <small className="error block text-red-600 absolute sm:-bottom-2 -bottom-3">
                      {errors["casherName"]}
                    </small>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-evenly  h-24">
                <div className="w-[80%] mx-auto flex flex-col justify-evenly h-20">
                  <div>Date</div>
                  <input
                    required
                    value={invoice.date}
                    onChange={(event) => {
                      setInvoice({
                        ...invoice,
                        date: event.target.value,
                      });
                      console.log(event.target.value);
                    }}
                    type="date"
                    className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400  focus:outline-gray-400 outline-1 w-[100%] "
                  />
                  {errors["date"] && (
                    <small className="error block text-red-600 absolute sm:-bottom-2 -bottom-3">
                      {errors["date"]}
                    </small>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-evenly  h-24">
                <div className="w-[80%] mx-auto flex flex-col justify-evenly h-20">
                  <label htmlFor="twonship">Township</label>
                  <select
                    onChange={(event) => {
                      setInvoice({ ...invoice, township: event.target.value });
                      console.log(event.target.value);
                    }}
                    value={invoice.township}
                    name="township"
                    id=""
                    className="focus:border-none focus:ring-0 py-2 px-3  ring-1 ring-gray-400  focus:outline-gray-400 outline-1 w-[100%] "
                  >
                    {township.map((township) => {
                      return (
                        <>
                          <option value={township}>{township}</option>
                        </>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className=" mt-3 lg:w-[90%] w-[80%] md:w-[90%] xl:w-[94%]   mx-auto">
              <div className="mb-2">
                <label htmlFor="">Remark</label>
              </div>
              <textarea
                value={invoice.remark}
                onChange={(event) => {
                  setInvoice({ ...invoice, remark: event.target.value });
                  console.log(event.target.value);
                }}
                name=""
                id=""
                rows={2}
                className="focus:border-none focus:ring-0 py-2 px-3  ring-1 ring-gray-400  focus:outline-gray-400 outline-1 w-[100%]"
              ></textarea>
            </div>
          </fieldset>
          <fieldset className="border-2 border-gray-400 rounded-sm lg:p-2 mt-3  overflow-hidden">
            <legend className="font-semibold  px-3">Invoice Details</legend>
            <div className="">
              <div className="overflow-auto  overflow-y-hidden  rounded-lg shadows  mx-auto">
                <table className="min-w-full divide-y divide-gray-200 mt-3 ">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className=" text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Set Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        <button
                          onClick={() => add()}
                          type="button"
                          className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-0 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        >
                          +ADD
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.invoiceDetailDtos.map((invoiceDetail, index) => (
                      <tr key={index} className="align-middle">
                        <td className="md:px-6 md:py-4  whitespace-nowrap text-center text-sm font-medium text-gray-800">
                          <div>{index + 1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 relative ">
                          <input
                            value={invoiceDetail.item}
                            onChange={(event) => {
                              console.log(event.target.value);
                              changeItem(event.target.value, invoiceDetail.id);
                            }}
                            required
                            type="text"
                            className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24 "
                          />
                          {errors[`invoiceDetailDtos.${index}.item`] && (
                            <small className="error block text-red-600  absolute bottom-0 left-0 right-0">
                              {errors[`invoiceDetailDtos.${index}.item`]}
                            </small>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 relative">
                          <div>
                            <input
                              onChange={(event) => {
                                console.log(event.target.value);
                                changePrice(
                                  Number(event.target.value),
                                  invoiceDetail.id
                                );
                              }}
                              min={0}
                              value={invoiceDetail.price}
                              required
                              inputMode="numeric"
                              type="number"
                              className="focus:border-none appearance-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                            />
                            {errors[`invoiceDetailDtos.${index}.price`] && (
                              <small className="error block text-red-600 text-sm  absolute bottom-0 left-0 right-0">
                                {errors[`invoiceDetailDtos.${index}.price`]}
                              </small>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                          <input
                            onChange={(event) => {
                              console.log(event.target.value);
                              changeQuantity(
                                Number(event.target.value),
                                invoiceDetail.id
                              );
                            }}
                            min={1}
                            value={invoiceDetail.quantity}
                            required
                            type="number"
                            className="focus:border-none appearance-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-[65px]"
                          />
                          {errors[`invoiceDetailDtos.${index}.quantity`] && (
                            <div className="error">
                              {errors[`invoiceDetailDtos.${index}.quantity`]}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800  ">
                          <div className="">
                            {numberWithCommas(
                              invoiceDetail.price * invoiceDetail.quantity
                            )}
                          </div>
                          {errors[`invoiceDetailDtos.${index}.setAmount`] && (
                            <small className="error">
                              {errors[`invoiceDetailDtos.${index}.setAmount`]}
                            </small>
                          )}
                        </td>

                        {invoice.invoiceDetailDtos.length !== 1 && (
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                            <button
                              onClick={() => remove(index)}
                              type="button"
                              className="focus:ring-0 text-red-700 hover:text-white border border-red-700 hover:bg-red-800  focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="">
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="font-semibold pt-5">Total Amount</td>
                      <td className="text-center pt-5">
                        {numberWithCommas(total())}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </fieldset>
          <div className="flex justify-end items-center mt-5">
            <button
              onClick={() => saveInvoice()}
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Save
            </button>
            <Link to={"/"}>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Invoice List
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
