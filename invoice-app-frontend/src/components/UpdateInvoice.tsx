import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { InvoiceDetail } from "../types/InvoiceDetail";
import { Invoice, township } from "../types/Invoice";
import { deleteInvoice, editInvoice, getInvoice } from "../api/invoice";
import { format } from "date-fns";
import { changeString, invoiceSchema } from "../util/validation";

const UpdateInvoice = () => {
  let currentDate = new Date();

  const navigate = useNavigate();
  const { invoiceId } = useParams();
  console.log(Number(invoiceId));

  const [value, setValue] = useState<number>(1);

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

  const index: number = township.indexOf(invoice.township);

  useEffect(() => {
    const invoiceDatabase = getInvoice(Number(invoiceId)).then((res) => {
      setInvoice(res.data);
    });
    setInvoice({ ...invoice, township: invoice.township });
  }, []);

  console.log(invoice.invoiceDetailDtos.map((a) => a.price));

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

    console.log(invoice);
  };

  const remove = (id: number | undefined) => {
    console.log(id);

    let details = invoice.invoiceDetailDtos.filter((ivd) => ivd.id !== id);

    let rDetail = invoice.invoiceDetailDtos.find((ivd) => ivd.id == id);

    setInvoice({ ...invoice, invoiceDetailDtos: details });
  };

  const changeItem = (item: string, id: number | undefined) => {
    console.log(item, id);
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.item = item;

    console.log(result);
    console.log(invoice.invoiceDetailDtos);
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
  console.log(invoice);

  const changeDate = (dateString: string) => {
    const dateParts = dateString.split("-"); // Split the string into year, month, and day parts
    const year = parseInt(dateParts[0], 10); // Convert year part to integer
    const month = parseInt(dateParts[1], 10) - 1; // Convert month part to integer and subtract 1
    const day = parseInt(dateParts[2], 10); // Convert day part to integer

    // Create a Date object using individual year, month, and day components
    const date = new Date(year, month, day);
    return date;
  };

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

  const updateInvoice = () => {
    validate(invoice);
    const result = invoiceSchema.safeParse(invoice);
    if (result.success) {
      try {
        editInvoice(invoice);
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeInvoice = (id: number) => {
    try {
      deleteInvoice(id);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[85%] mx-auto mt-10 border-2  border-gray-400 rounded-lg p-3 mb-3">
      <form action="">
        <div>
          <header className="font-semibold">INVOICE</header>
          <div className="border-2 border-gray-400 rounded-lg p-5 mt-3">
            <div className="grid grid-cols-3 gap-16">
              <div className="flex justify-around items-center">
                <div>Casher Name</div>
                <input
                  onChange={(event) => {
                    setInvoice({ ...invoice, casherName: event.target.value });
                    console.log(invoice);
                  }}
                  min={1}
                  value={invoice.casherName}
                  className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                  placeholder="casher number"
                />
                {errors["casherName"] && (
                  <small className="error block text-red-600">
                    {errors["casherName"]}
                  </small>
                )}
              </div>
              <div className="flex justify-around items-center">
                <div>Date</div>
                <input
                  required
                  value={invoice.date}
                  onChange={(event) => {
                    setInvoice({ ...invoice, date: event.target.value });
                    console.log(event.target.value);
                  }}
                  type="date"
                  className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400  focus:outline-gray-400 outline-1"
                  placeholder=""
                />
              </div>
              <div className="flex justify-around items-center">
                <label htmlFor="twonship">Township</label>
                <select
                  value={invoice.township}
                  onChange={(event) => {
                    setInvoice({ ...invoice, township: event.target.value });
                    console.log(event.target.value);
                  }}
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
            <div className="ps-7 mt-7 ">
              <div className="mb-5">
                <label htmlFor="">Remark</label>
              </div>
              <textarea
                defaultValue={invoice.remark as string}
                onChange={(event) => {
                  setInvoice({ ...invoice, remark: event.target.value });
                  console.log(event.target.value);
                }}
                name=""
                id=""
                rows={4}
                className="focus:border-none focus:ring-0 py-2 px-3  ring-1 ring-gray-400  focus:outline-gray-400 outline-1 w-full"
              ></textarea>
            </div>
          </div>
          <div className="mt-5">
            <header className="font-semibold">INVOICE DETAILS</header>
            <div className="border-2 border-gray-400 rounded-lg p-5 mt-3">
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
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-800">
                          <div>{index + 1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 relative">
                          <input
                            defaultValue={invoiceDetail.item}
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
                          <input
                            value={invoiceDetail.price}
                            onChange={(event) => {
                              changePrice(
                                Number(event.target.value),
                                invoiceDetail.id
                              );
                            }}
                            min={1}
                            required
                            type="number"
                            className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                          />
                          {errors[`invoiceDetailDtos.${index}.price`] && (
                            <small className="error block text-red-600  absolute bottom-0 ">
                              {errors[`invoiceDetailDtos.${index}.price`]}
                            </small>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                          <input
                            onChange={(event) => {
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                          <div>{invoiceDetail.totalAmount}</div>
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
                              onClick={() => remove(invoiceDetail.id)}
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
              onClick={() => updateInvoice()}
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Update
            </button>
            <button
              onClick={() => removeInvoice(Number(invoiceId))}
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Delete
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

export default UpdateInvoice;
