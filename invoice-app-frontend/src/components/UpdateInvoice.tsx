import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { InvoiceDetail } from "../types/InvoiceDetail";
import { Invoice, township } from "../types/Invoice";
import { deleteInvoice, editInvoice, getInvoice } from "../api/invoice";
import { format } from "date-fns";
import { invoiceSchema } from "../util/validation";
import { useAppDispatch } from "../app/hook";
import { setClose, setOpen } from "../app/slice/alertSlice";

const UpdateInvoice = () => {
  let currentDate = new Date();

  const navigate = useNavigate();
  const { invoiceId } = useParams();

  const [value, setValue] = useState<number>(1);
  const [invoiceFromDb, setInvoiceFromDb] = useState<Invoice>();
  const dispatch = useAppDispatch();
  let [invoice, setInvoice] = useState<Invoice>({
    invoiceId: 0,
    casherName: "",
    township: township[2],
    date: "",
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
      setInvoiceFromDb(res.data);
    });
    setInvoice({ ...invoice, township: invoice.township });
  }, []);

  const add = () => {
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
    let details = invoice.invoiceDetailDtos.filter((_, i) => i !== index);

    //let rDetail = invoice.invoiceDetailDtos.find(ivd => ivd.id === id)

    setInvoice({ ...invoice, invoiceDetailDtos: details });
  };

  const changeItem = (item: string, id: number | undefined) => {
    const result = invoice.invoiceDetailDtos.find(
      (data) => data.id === id
    ) as InvoiceDetail;
    result.item = item;

    const newInvoiceDetail = invoice.invoiceDetailDtos.map((idd) =>
      idd.id === result.id ? result : idd
    );
    setInvoice({ ...invoice, invoiceDetailDtos: newInvoiceDetail });
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
        dispatch(
          setOpen({
            color: "text-[#EEF7FF]",
            isOpen: true,
            message: "You Updateed invoice successfully",
          })
        );

        navigate("/");
        setTimeout(() => {
          dispatch(setClose());
        }, 4000);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(invoice);
  };

  const removeInvoice = (id: number) => {
    try {
      deleteInvoice(id);
      dispatch(
        setOpen({
          color: "text-[#EEF7FF]",
          isOpen: true,
          message: "You deleted invoice successfully",
        })
      );

      navigate("/");
      setTimeout(() => {
        dispatch(setClose());
      }, 4000);
    } catch (error) {
      console.log(error);
    }
  };

  const total = () => {
    let value = 0;

    const a = invoice.invoiceDetailDtos.map((detail) => {
      value += detail.price * detail.amount;
    });

    return value;
  };

  console.log(errors);

  return (
    <div className="w-[80%] mx-auto mt-3 md:px-10 px-5  mb-1">
      <form action="">
        <div>
          <fieldset className="border-2 border-gray-400 rounded-sm md:px-2 pb-3 ">
            <legend className="font-semibold ms-4 px-3 ">Invoice</legend>

            <div className="grid xl:grid-cols-3 md:grid-cols-2  xl:gap-10 md:gap-5  h-fit  w-[100%] ">
              <div className="flex flex-col justify-evenly  h-24">
                <div className="w-[80%] mx-auto flex flex-col justify-evenly h-28 relative sm-mb-5 md:mb-0 sm:mb-0">
                  <div>Casher Name</div>
                  <input
                    value={invoice.casherName}
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
                    placeholder=""
                  />
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
          <fieldset className="border-2 border-gray-400 rounded-sm lg:p-5 mt-5">
            <legend className="font-semibold ms-4 px-3">Invoice Details</legend>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Total Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      <button
                        onClick={() => add()}
                        type="button"
                        className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-0 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        +++ADD
                      </button>
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
                          value={invoiceDetail.item}
                          onChange={(event) => {
                            console.log(event.target.value);
                            changeItem(event.target.value, invoiceDetail.id);
                          }}
                          required
                          type="text"
                          className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-24"
                        />
                        {errors[`invoiceDetailDtos.${index}.item`] && (
                          <small className="error block text-red-600 absolute bottom-0 left-0 right-0">
                            {errors[`invoiceDetailDtos.${index}.item`]}
                          </small>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 relative">
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
                        />
                        {errors[`invoiceDetailDtos.${index}.price`] && (
                          <small className="error block text-red-600 text-sm absolute bottom-0 left-0 right-0">
                            {errors[`invoiceDetailDtos.${index}.price`]}
                          </small>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
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
                          className="focus:border-none focus:ring-0 py-2 px-3 outline-none ring-1 ring-gray-400 focus:outline-gray-400 outline-1 w-[65px]"
                        />
                        {errors[`invoiceDetailDtos.${index}.amount`] && (
                          <div className="error">
                            {errors[`invoiceDetailDtos.${index}.amount`]}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                        <div>{invoiceDetail.price * invoiceDetail.amount}</div>
                        {errors[`invoiceDetailDtos.${index}.amount`] && (
                          <small className="error">
                            {errors[`invoiceDetailDtos.${index}.amount`]}
                          </small>
                        )}
                      </td>
                      {invoice.invoiceDetailDtos.length !== 1 && (
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                          <button
                            onClick={() => remove(index)}
                            type="button"
                            className="focus:ring-0 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="font-semibold">Total Amount</td>
                    <td className="text-center">{total()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end items-center mt-5">
          <button
            onClick={() => updateInvoice()}
            type="button"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Update
          </button>

          <button
            onClick={() => removeInvoice(Number(invoice.invoiceId))}
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
      </form>
    </div>
  );
};

export default UpdateInvoice;
