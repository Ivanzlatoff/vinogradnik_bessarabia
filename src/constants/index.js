import {register} from 'timeago.js';
import { useState } from 'react';
import { useEffect } from 'react';


export const TOKEN = 'TOKEN';

export const ruLocaleFunc = (number, index, totalSec) => {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  const translations =  [
    ['только что', 'прямо сейчас'],
    ['%s секунд назад', 'через %s секунд'],
    ['1 минуту назад', 'через 1 минуту'],
    ['%s минут назад', 'через %s минут'],
    ['1 час назад', 'через 1 час'],
    ['%s часов назад', 'через %s часов'],
    ['1 день назад', 'через 1 день'],
    ['%s днів тому', 'через %s дней'],
    ['1 неделю назад', 'через 1 неделю'],
    ['%s недель назад', 'через %s недель'],
    ['1 месяц назад', 'через 1 месяц'],
    ['%s месяцев назад', 'через %s месяцев'],
    ['1 год назад', 'через 1 год'],
    ['%s лет назад', 'через %s лет']
  ];

  return translations[index];
};
// register your locale with timeago
register('ru-locale', ruLocaleFunc);

export const uaLocaleFunc = (number, index, totalSec) => {
  const translations =  [
    ['щойно', 'прямо зараз'],
    ['%s секунд тому', 'через %s секунд'],
    ['1 хвилину тому', 'через 1 хвилину'],
    ['%s хвилин тому', 'через %s хвилин'],
    ['1 годину тому', 'через 1 годину'],
    ['%s годин тому', 'через %s годин'],
    ['1 день тому', 'через 1 день'],
    ['%s днів тому', 'через %s днів'],
    ['1 тиждень тому', 'через 1 тиждень'],
    ['%s тижнів тому', 'через %s тижнів'],
    ['1 місяць тому', 'через 1 місяць'],
    ['%s місяців тому', 'через %s місяців'],
    ['1 рік тому', 'через 1 рік'],
    ['%s років тому', 'через %s років']
  ];

  return translations[index];
};
// register your locale with timeago
register('ua-locale', uaLocaleFunc);

export function useLocale() {
    const [locale, setLocale] = useState('en-locale');
    const lang = localStorage.getItem("i18nextLng");
    useEffect(() => {
        setLocale(lang === 'ua' ? 'ua-locale' : 'en-locale');  
    }, [lang])
    return locale;
};