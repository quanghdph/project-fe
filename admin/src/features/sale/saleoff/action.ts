import {
  createSelloffStart,
  createSelloffSuccess,
  createSelloffFailed,
  caculateSelloffSuccess,
  caculateSelloffFailed,
  caculateSelloffStart,
} from "./selloffSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

export const createSelloff = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
    const { idKhachHang, thanhToan, trangThaiTT, note, sanPhams } = params;
    dispatch(createSelloffStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<{}> = await axiosClientJwt.post(
      `/selloff`,
      {
        idKhachHang,
        thanhToan,
        trangThaiTT,
        note,
        sanPhams,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(createSelloffSuccess(res.data));
        console.log(res.data);
        message.success("Thanh toán thành công!");
        // navigate("/catalog/selloffs");
      }, 1000);
    } else {
    
      dispatch(createSelloffFailed(null));
    }
  } catch (error: any) {
    dispatch(createSelloffFailed(null));
    Inotification({
      type: "error",
      message: error.response.data,
    });
  }
};

export const caculateSelloff = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
    const { idKhachHang, thanhToan, trangThaiTT, note, sanPhams } = params;
    dispatch(caculateSelloffStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<{}> = await axiosClientJwt.post(
      `/selloff/calculate-money`,
      {
        idKhachHang,
        thanhToan,
        trangThaiTT,
        note,
        sanPhams,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(caculateSelloffSuccess(res.data));
        message.success("Thanh toán thành công!");
        // navigate("/catalog/selloffs");
      }, 1000);
    } else {
    
      dispatch(caculateSelloffFailed(null));
    }
  } catch (error: any) {
    console.log(error)
    dispatch(caculateSelloffFailed(null));
    Inotification({
      type: "error",
      message: error.response.data,
    });
  }
};
