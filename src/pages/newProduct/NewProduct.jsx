import { useState } from "react";
import "./newProduct.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { addProduct } from '../../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function NewProduct() {
  const [ inputs, setInputs ] = useState({});
  const [ file, setFile ] = useState(null);
  const [ cat, setCat ] = useState([]);
  const [ color, setColor ] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { t } = useTranslation(["newProduct"]);
  const isFetching = useSelector(state => state.product.isFetching);

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
  }

  const handleColor = (e) => {
    setColor(e.target.value.split(","));
  }

  const canSave = [inputs.title, inputs.price, inputs.inStock, file, cat.length, color.length].every(Boolean) && !isFetching;

  const handleClick = (e) => {
    if (canSave) {
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
                  const product = { ...inputs, type: inputs.title, img: downloadURL, categories: cat, color };
                  addProduct(product, dispatch)
                });
              },
              navigate('/products/')
              );
      } else {
        const product = { ...inputs, type: inputs.title, img: "", categories: cat, color };
        addProduct(product, dispatch);
        navigate('/products/');
      };
    }
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">{t("newProduct")}</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>{t("image")}</label>
          <input type="file" id="file" onChange={e => setFile(e.target.files[0])}/>
        </div>
        <div className="addProductItem">
          <label>{t("title")}</label>
          <input name="title" type="text" placeholder="Caubernet" onChange={handleChange}/>
        </div>
        <div className="addProductItem">
          <label>{t("descEn")}</label>
          <input name="desc_en" type="text" placeholder="description..." onChange={handleDesc}/>
        </div>
        <div className="addProductItem">
          <label>{t("descUa")}</label>
          <input name="desc_ua" type="text" placeholder="опис..." onChange={handleDesc}/>
        </div>
        <div className="addProductItem">
          <label>{t("descRu")}</label>
          <input name="desc_ru" type="text" placeholder="описание..." onChange={handleDesc}/>
        </div>
        <div className="addProductItem">
          <label>{t("price")}</label>
          <input name="price" type="number" placeholder="UAH 25" onChange={handleChange}/>
        </div>
        <div className="addProductItem">
          <label>{t("color")}</label>
          <input type="text" placeholder="red, white" onChange={handleColor}/>
        </div>
        <div className="addProductItem">
          <label>{t("categories")}</label>
          <input type="text" placeholder="european, hybrid" onChange={handleCat}/>
        </div>
        <div className="addProductItem">
          <label>{t("stock")}</label>
          <select name="inStock" onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button 
          onClick={handleClick} 
          className="addProductButton"
          disabled={!canSave}
        >
          {t("button")}
        </button>
      </form>
    </div>
  );
}
