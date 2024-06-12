import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useDispatch } from "react-redux";
import { setOpen } from "../app/slice/alertSlice";

interface Props {
  color: string;
  message: string;
  isOpen:false
}

const AlertBox = () => {

    const {color,isOpen,message} = useAppSelector(state => state.alert)

    const dispatch = useAppDispatch()

    // dispatch(setOpen({
    //     isOpen:false,
    //     color:"dfas",
    //     message:""
    // }))

  return (
    <div className={`mt-2 bg-[#26303E] text-sm ${color} rounded-lg p-4 absolute bottom-2 right-2 transition-all delay-300 ${!isOpen && 'hidden'}`} role="alert">
    <span className="font-bold">{message}</span>
  </div>
  );
};

export default AlertBox;
