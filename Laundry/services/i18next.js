import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import hi from "../locales/hi.json";
import ur from '../locales/ur.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';
import kn from '../locales/kn.json';
import or from '../locales/or.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';



export const languageResources = {
  en: {translation: en},
  hi: {translation: hi},
  ur: {translation: ur},
  te: {translation: te},
  ta: {translation: ta},
  kn: {translation: kn},
  or: {translation: or},
  zh: {translation: zh},
  ja: {translation: ja},

};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;