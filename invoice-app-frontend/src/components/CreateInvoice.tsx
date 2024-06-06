import React, { useState } from "react";
import { Invoice, township } from "../types/Invoice";
import { InvoiceDetail } from "../types/InvoiceDetail";
import { createInvoice } from "../api/invoice";
import { Link, redirect, useNavigate } from "react-router-dom";
import { changeString, invoiceSchema } from "../util/validation";
import { format } from "date-fns";

const CreateInvoice = () => {
  let currentDate = new Date();

  const navigate = useNavigate();

  const [value, setValue] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number[]>();

  let [invoice, setInvoice] = useState<Invoice>({
    casherName: "",
    township: township[2],
    date: changeString(currentDate),
    remark: "",
    invoiceDetailDtos: [
      {
        id: 1,
        item: "",
        price: 0,
        amount: 1,
        totalAmount: 0,
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
        { id: value + 1, item: "", price: 0, amount: 1, totalAmount: 0 },
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

    console.log(result);
    console.log(invoice);
  };

  const changePrice = (price: number, id: number | undefined) => {
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.price = price;
    result.totalAmount = result.amount * result.price;
    const final = invoice.invoiceDetailDtos.map((data) =>
      data.id == result.id ? result : data
    );
    setInvoice({ ...invoice, invoiceDetailDtos: final });
  };
  const changeQuantity = (quantity: number, id: number | undefined) => {
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.amount = quantity;
    result.totalAmount = result.amount * result.price;
    const final = invoice.invoiceDetailDtos.map((data) =>
      data.id == result.id ? result : data
    );
    setInvoice({ ...invoice, invoiceDetailDtos: final });
  };

  const saveInvoice = () => {
    validate(invoice);
    const result = invoiceSchema.safeParse(invoice);
    if (result.success) {
      try {
        createInvoice(invoice);
        navigate("/");
        //window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(errors);

  return (
    <div className="w-[85%] mx-auto mt-10 border-2  border-gray-400 rounded-lg px-10 py-5 mb-3">
      <form action="">
        <div>
          <header className="font-semibold">INVOICE</header>
          <div className="border-2 border-gray-400 rounded-sm px-10 py-5 mt-3">
            <div className="grid grid-cols-3 gap-16 h-fit">
              <div className="grid grid-col-3 gap-1 h-10 ">
                <div>Casher Number</div>
                <input
                  onChange={(event) => {
                    setInvoice({
                      ...invoice,
                      casherName: event.target.value,
                    });
                    console.log(invoice);
                  }}
                  min={1}
                  className=" focus:border-none  focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 "
                  placeholder="casher number"
                />
                {errors["casherName"] && (
                  <small className="error block text-red-600">{errors["casherName"]}</small>
                )}
              </div>
              <div className="grid grid-col-3 gap-1">
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
                  className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400  focus:outline-gray-400 outline-1"
                  placeholder=""
                />
              </div>
              <div className="grid grid-col-3 gap-1">
                <label htmlFor="twonship">Township</label>
                <select
                  onChange={(event) => {
                    setInvoice({ ...invoice, township: event.target.value });
                    console.log(event.target.value);
                  }}
                  value={invoice.township}
                  name="township"
                  id=""
                  className="focus:border-none focus:ring-0 py-2 px-3  ring-1 ring-gray-400  focus:outline-gray-400 outline-1"
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
            <div className=" mt-7 ">
              <div className="mb-5">
                <label htmlFor="">Remark</label>
              </div>
              <textarea
                onChange={(event) => {
                  setInvoice({ ...invoice, remark: event.target.value });
                  console.log(event.target.value);
                }}
                name=""
                id=""
                rows={3}
                className="focus:border-none focus:ring-0 py-2 px-3  ring-1 ring-gray-400  focus:outline-gray-400 outline-1 w-[100%]"
              ></textarea>
            </div>
          </div>
          <div className="mt-5">
            <header className="font-semibold">INVOICE DETAILS</header>
            <div className="border-2 border-gray-400 rounded-sm p-5 mt-3">
              <div>
                <table className="min-w-full divide-y divide-gray-200 mt-5">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
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
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Total Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.invoiceDetailDtos.map((invoiceDetail, index) => (
                      <tr key={index} className="align-middle">
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800">
                          <div>{index + 1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 relative">
                          <input
                            onChange={(event) => {
                              console.log(event.target.value);
                              changeItem(event.target.value, invoiceDetail.id);
                            }}
                            required
                            type="text"
                            className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                          />
                          {errors[`invoiceDetailDtos.${index}.item`] && (
                            <small className="error block text-red-600  absolute bottom-0">
                              {errors[`invoiceDetailDtos.${index}.item`]}
                            </small>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 relative">
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
                              type="number"
                              className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                            />{" "}
                            {errors[`invoiceDetailDtos.${index}.price`] && (
                              <small className="error block text-red-600  absolute bottom-0 ">
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
                            value={invoiceDetail.amount}
                            required
                            type="number"
                            className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                          />
                          {errors[`invoiceDetailDtos.${index}.amount`] && (
                            <div className="error">
                              {errors[`invoiceDetailDtos.${index}.amount`]}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                          <div>{invoiceDetail.totalAmount}</div>
                          {errors[`invoiceDetailDtos.${index}.amount`] && (
                            <small className="error">
                              {errors[`invoiceDetailDtos.${index}.amount`]}
                            </small>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                          <button
                            onClick={() => add()}
                            type="button"
                            className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-0 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                          >
                            ADD
                          </button>
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
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center mt-5">
            <button
              onClick={() => saveInvoice()}
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Save
            </button>
            
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
          <Link to={"/"}>Invoice List</Link>
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
