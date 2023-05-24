import {
  Person,
  PermIdentity,
  LocalShippingOutlined,
  CalendarToday,
  Place,
  MailOutline,
} from "@material-ui/icons";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./order.css";
import {format} from 'timeago.js';
import { useState } from "react";
import { updateOrder } from "../../redux/apiCalls";
import { useTranslation } from 'react-i18next';
import { useLocale } from "../../constants";


const Order = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const order = useSelector((state) => 
    state.order.orders.find(order => order._id === orderId)
  );
  
  const [ status, setStatus ] = useState('');
  const { t } = useTranslation(["order"]);
  const locale = useLocale();

  const handleUpdateOrder = (e) => {
    setStatus(e.target.value)
  };

  const handleClick = (e) => {
    e.preventDefault();
    const orderToUpdate = {
        ...order,
        status
    };
    updateOrder(orderId, orderToUpdate, dispatch);
    setStatus('');
  }

  return (
    <div className="order">
        <button 
            className={!status ? "displayNone" : "orderUpdateButton"}
            onClick={(e) => handleClick(e)}
        >
            {t("update")}
        </button>
        <h1 className="orderTitle">{t("title")} {order._id}</h1>
        <div className="personalInfo">
            <div className="left">
                <div className="infoTitle">
                    <Person />
                    <h2>{t("personalInfo.title")}</h2>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle"><PermIdentity className="userShowIcon"/> {t("personalInfo.userId")}</p>
                    <p>{order.userId}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle"><MailOutline className="userShowIcon"/> {t("personalInfo.userEmail")}</p>
                    <p>{order.email}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle"><LocalShippingOutlined className="userShowIcon"/> {t("personalInfo.orderStatus")}</p>
                    <select 
                        name="status" 
                        defaultValue={order.status} 
                        className={status ? "status_" + status : "status_" + order.status}
                        onChange={(e) => handleUpdateOrder(e)}
                    >
                        <option value="approved">{t("approved")}</option>
                        <option value="shipped">{t("shipped")}</option>
                        <option value="declined">{t("declined")}</option>
                        <option value="delivered">{t("delivered")}</option>
                        <option value="pending">{t("pending")}</option>
                    </select>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle"><CalendarToday className="userShowIcon"/> {t("personalInfo.createdAt")}</p>
                    <p>{format(order.createdAt, locale)}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle"><CalendarToday className="userShowIcon"/> {t("personalInfo.updatedAt")}</p>
                    <p>{format(order.updatedAt, locale)}</p>
                </div>
            </div>
            <div className="right">
                <div className="infoTitle">
                    <Place />
                    <h2>{t("address.title")}</h2>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle">{t("address.street")}</p>
                    <p>{order.address?.line1}</p>
                </div>    
                <div className="infoLine">
                    <p className="infoLineTitle"></p>
                    <p>{order.address?.line2}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle">{t("address.city")}</p>
                    <p>{order.address?.city}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle">{t("address.state")}</p>
                    <p>{order.address?.state}</p>
                </div>
                <div className="infoLine">
                    <p className="infoLineTitle">{t("address.postCode")}</p>
                    <p>{order.address?.postal_code}</p>
                </div> 
            </div>
        </div>
        <div className="productsInfo">
            <h2 className="order">{t("products.title")}</h2>
            <table className="productsTable">
                <thead>
                    <tr className="productTr">
                        <th className="productsTh">{t("products.productId")}</th>
                        <th className="productsTh">{t("products.productTitle")}</th>
                        <th className="productsTh">{t("products.color")}</th>
                        <th className="productsTh">{t("products.quantity")}</th>
                        <th className="productsTh">{t("products.price100kg")}</th>
                        <th className="productsTh">{t("products.priceProduct")}</th>
                    </tr>
                </thead>
                {order.products.map((product) => (
                    <tbody key={product._id}>
                        <tr className="productTr" key={product._id}>
                            <td className="productTh">{product.productId}</td>
                            <td className="productTh">{product.title}</td>
                            <td className="productTh">{product.color}</td>
                            <td className="productTh">{product.quantity}</td>
                            <td className="productTh">{product.price} {t("uah")}</td>
                            <td className="productTh">{product.quantity * product.price} {t("uah")}</td>
                        </tr>
                    </tbody>
                ))}
            </table>
            <h2 className="totalAmount">{t("totalAmount")} {order.amount} {t("uah")}</h2>
        </div>
    </div>
  );
};

export default Order;
