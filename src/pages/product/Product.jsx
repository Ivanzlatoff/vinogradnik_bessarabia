import { Link, useLocation, useNavigate } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart"
import { Publish } from "@material-ui/icons";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from "react";
import { userRequest } from "../../requestMethods";
import { updateProduct } from "../../redux/apiCalls";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useTranslation } from "react-i18next";


const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const productId = location.pathname.split("/")[2];
    const product = useSelector((state) => 
        state.product.products.find(product => product._id === productId)
    );
    const isFetching = useSelector((state) => 
        state.product.isFetching
    );

    const [pStats, setPStats] = useState([]);
    const [totalSales, setTotalSales] = useState('');
    const [inputs, setInputs] = useState({});
    const [ file, setFile ] = useState(null);
    const [ cat, setCat ] = useState([]);
    const [ color, setColor ] = useState([]);
    const dispatch = useDispatch();
    const { t } = useTranslation(["product"]);

    const MONTHS = useMemo(
        () => [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ], 
        []
    );

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const res = await userRequest.get("orders/income?pid=" + productId);
                const list = res.data.sort((a,b) => {
                    return a._id - b._id
                });
                setPStats([]);
                setTotalSales('');
                !ignore && list.map((item) => 
                    setPStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], Sales: item.total },
                    ])
                );
                !ignore && setTotalSales(list.reduce((sum, { total }) => sum + total, 0))
            } catch (err) {
                console.log(err);
            }
        })();

        return () => ignore = true;
    }, [productId, MONTHS]);

    const handleChange = (e) => {
        setInputs(prev => {
            return {...prev, [e.target.name]: e.target.value}
        })
    };

    const handleDesc = (e) => {
        setInputs(prev => {
            return {
                ...prev,
                [(e.target.name).slice(0,4)]: {
                    ...inputs[(e.target.name).slice(0,4)],
                    [(e.target.name).slice(-2)]: e.target.value
                }
            }
        })
    }

    const handleCat = (e) => {
        setCat(e.target.value.split(","));
    };

    const handleColor = (e) => {
        setColor(e.target.value.split(","));
    };

    const category = cat.length === 0 ? product?.categories : cat;
    const colour = color.length === 0 ? product?.color : color;

    const handleClick = (e) => {
        e.preventDefault();
        if (file) {
            const fileName = new Date().getTime() + file.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                default:
                }
            }, 
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const productToUpdate = { 
                        ...inputs, 
                        type: inputs.title, 
                        img: downloadURL, 
                        categories: category, 
                        color: colour
                    };
                    updateProduct(productId, productToUpdate, dispatch)
                });
            },
            navigate('/products/')
            );
        } else {
          const productToUpdate = { 
            ...inputs, 
            type: inputs.title, 
            img: product.img, 
            categories: category, 
            color: colour
        };
          updateProduct(productId, productToUpdate, dispatch);
          navigate('/products/');
        }
    };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">{t("product")}</h1>
        <Link to="/newproduct">
          <button className="productAddButton">{t("create")}</button>
        </Link>
      </div>
      <div className="productTop">
          <div className="productTopLeft">
              <Chart data={pStats} dataKey="Sales" title={t("sales_performance")}/>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                  <img src={product?.img} alt="" className="productInfoImg" />
                  <span className="productName">{t(product?.title)}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">id:</span>
                      <span className="productInfoValue">{product?._id}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">{t("sales")}</span>
                      <span className="productInfoValue">{totalSales}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">{t("inStock")}</span>
                      <span className="productInfoValue">{product?.inStock ? t("true") : t("false")}</span>
                  </div>
              </div>
          </div>
      </div>
      <div className="productBottom">
          <form className="productForm">
              <div className="productFormLeft">
                  <label>{t("productName")}</label>
                  <input name="title" type="text" defaultValue={t(product?.title)} onChange={handleChange}/>
                  <label>{t("productDesc")} EN</label>
                  <textarea name="desc en" type="text" defaultValue={product?.desc.en} onChange={handleDesc}/>
                  <label>{t("productDesc")} UA</label>
                  <textarea name="desc ua" type="text" defaultValue={product?.desc.ua} onChange={handleDesc}/>
                  <label>{t("productDesc")} RU</label>
                  <textarea name="desc ru" type="text" defaultValue={product?.desc.ru} onChange={handleDesc}/>
                  <label>{t("price")}</label>
                  <input name="price" type="text" defaultValue={product?.price} onChange={handleChange}/>
                  <label>{t("color")}</label>
                  <input type="text" defaultValue={product?.color} onChange={handleColor}/>
                  <label>{t("categories")}</label>
                  <input type="text" defaultValue={product?.categories} onChange={handleCat}/>
                  <label>{t("inStock")}</label>
                  <select name="inStock" id="idStock" onChange={handleChange}>
                      <option value="true">{t("true")}</option>
                      <option value="false">{t("false")}</option>
                  </select>
              </div>
              <div className="productFormRight">
                  <div className="productUpload">
                      <img src={product?.img} alt="" className="productUploadImg" />
                      <label htmlFor="file">
                          <Publish className="publish"/>
                      </label>
                      <input type="file" id="file" style={{display:"none"}} onChange={e => setFile(e.target.files[0])}/>
                  </div>
                  <button className="productButton" onClick={(e) => handleClick(e, product._id, product)} disabled={isFetching}>{t("update")}</button>
              </div>
          </form>
      </div>
    </div>
  );
}

export default Product;