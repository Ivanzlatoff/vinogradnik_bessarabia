import { useSelector } from 'react-redux';
import { useLocation, NavLink } from "react-router-dom";
import "./message.css";
import {format} from 'timeago.js';
import { useEffect } from 'react';
import { setMessageRead } from '../../redux/apiCalls';
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../constants';


const Message = () => {
    const location = useLocation();
    const messageId = location.pathname.split("/")[2];
    const message = useSelector(state => 
        state.message.messages.find(message => message._id === messageId)
    );
    const dispatch = useDispatch();
    const { t } = useTranslation(["message"]);
    const locale = useLocale();

    useEffect(() => {
        const messageToUpdate = {
            ...message,
            read: true
        }
        setMessageRead(messageId, messageToUpdate, dispatch);
    }, [dispatch, messageId, message])
    
    if (!message) {
        return (
            <section>
                <h2>{t("messageNotFound")}</h2>
            </section>
        )
    }


  return (
    <section className='messageContainer'>
      <article className="message">
        <h2>{message.subject}</h2>
            <div className="topLine">
                <div>
                    <b>{t("receivedFromUsername")}</b>: {message.username}
                </div>
                <div>
                    <b>{t("userId")}</b>: {message.userId}
                </div>
            </div>
            <div className="middleLine">
                <b>{t("fullName")}</b>: 
                <span> {message.title ? message.title : ''} </span> 
                <span>{message.firstName ? message.firstName : ''} </span>
                <span>{message.lastName ? message.lastName : ''}</span>
            </div>
            <div className="middleLine">
                <div className="emailLine"><b>{t("email")}</b>: {message.email ? message.email : 'unknown'}</div>
            </div>
            <div className="middleLine">
                <b>{t("telephone")}</b>: {message.telephone ? message.telephone : t("unknown")}
            </div>
        <p className='messageContent'>{message.message}</p>
        <div className='bottomLine'>
            <p className="timeSent">{format(message.createdAt, locale)}</p>
            {message.userId !== 'unregistered' && 
            <NavLink to={`/user/${message.userId}`}>
                <p className="timeSent">{t("allMessagessFromUser")}</p>
            </NavLink>}
        </div>
      </article>
    </section>
  )
}

export default Message;
