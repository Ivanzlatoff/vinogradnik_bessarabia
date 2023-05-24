import { useState } from "react";
import { userRequest } from "../../requestMethods";
import "./newUser.css";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';


export default function NewUser() {
  const [inputs, setInputs] = useState({});
  const [ file, setFile ] = useState(null);
  const { t } = useTranslation(["newUser"])
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault()
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    let user;
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
            user = { ...inputs, img: downloadURL };
          });
        },
      );
    } else {
        user = { ...inputs };
      };
    try {
      await userRequest.post("/auth/register", user);
      setInputs({});
      navigate("/user")
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">{t("title")}</h1>
      <form className="newUserForm" onSubmit={handleSubmit(handleCreateUser)}>
        <div className="newUserItem">
          <label>{t("image")}</label>
          <input type="file" id="file" onChange={e => setFile(e.target.files[0])}/>
        </div>
        <div className="newUserItem">
          <label>{t("username")}</label>
          <input 
            {...register('username', { maxLength: 20 })}
            type="text" 
            name='username'
            placeholder={t("namePlaceholder")} 
            onChange={(e) => handleChange(e)}
          />
          {errors.username && <p style={{ color: 'red' }}>{t("username_check")}</p>}
        </div>
        <div className="newUserItem">
          <label>{t("fullName")}</label>
          <input
            {...register('fullname', { maxLength: 100 })} 
            type="text" 
            name="fullname"
            placeholder={t("fullnamePlaceholder")}
            onChange={(e) => handleChange(e)}
          />
          {errors.fullname && <p style={{ color: 'red' }}>{t("fullname_check")}</p>}
        </div>
        <div className="newUserItem">
          <label>{t("email")}</label>
          <input 
            {...register('email', 
            { 
                required: 'This is required',
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            })}
            type="email" 
            name="email"
            placeholder={t("emailPlaceholder")} 
            onChange={(e) => handleChange(e)}
          />
          {errors.email && <p style={{ color: 'red' }}>{t("email_check")}</p>}
        </div>
        <div className="newUserItem">
          <label>{t("password")}</label>
          <input 
            {...register('password', { 
                required: 'This is required',
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
            })}
            type="password" 
            name="password"
            placeholder={t("password")} 
            onChange={(e) => handleChange(e)}
          />
          {errors.password && <p style={{ color: 'red' }}>{t("password_check")}</p>}
        </div>
        <div className="newUserItem">
          <label>{t("phone")}</label>
          <input 
            type="text" 
            placeholder={t("phonePlaceholder")} 
          />
        </div>
        <div className="newUserItem">
          <label>{t("passwordConfirm")}</label>
          <input 
            {...register('passwordConfirm', { 
                required: 'This is required',
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
            })}
            type="password" 
            name="passwordConfirm"
            placeholder={t("confirm_password_placeholder")} 
            onChange={(e) => handleChange(e)}
          />
          {inputs.password === inputs.passwordConfirm 
            ? inputs.password && <div style={{ color: 'green' }}>{t("passwords_match")}</div>
            : inputs.passwordConfirm && <div style={{ color: 'red' }}>{t("passwords_not_match")}</div>}
        </div>
        <div className="newUserItem">
          <label>{t("address")}</label>
          <input
            {...register('address', { maxLength: 500 })}
            type="text"
            name="address"
            placeholder={t("addressPlaceholder")}
            onChange={(e) => handleChange(e)}
          />
          {errors.address && <p style={{ color: 'red' }}>{t("address_check")}</p>}
        </div>
        <div className="newUserItem">
          <label>{t("gender")}</label>
          <div className="newUserGender">
            <input type="radio" name="gender" id="male" value="male" onChange={(e) => handleChange(e)}/>
            <label for="male">{t("male")}</label>
            <input type="radio" name="gender" id="female" value="female" onChange={(e) => handleChange(e)}/>
            <label for="female">{t("female")}</label>
            <input type="radio" name="gender" id="other" value="other" onChange={(e) => handleChange(e)}/>
            <label for="other">{t("other")}</label>
          </div>
        </div>
        <div className="newUserItem">
          <label>{t("active")}</label>
          <select className="newUserSelect" name="active" id="active" onChange={(e) => handleChange(e)} defaultValue="Yes">
            <option value="yes">{t("yes")}</option>
            <option value="no">{t("no")}</option>
          </select>
        </div>
        <button className="newUserButton" type='submit'>{t("create")}</button>
      </form>
    </div>
  );
}
