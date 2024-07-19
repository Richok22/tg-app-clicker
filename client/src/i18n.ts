import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        main: 'Main',
        tasks: 'Tasks',
        frens: 'Frens',
        loading: 'Loading...',
        daily: 'Daily income:',
        invite: 'Invite friend!',
        restricted: 'You silly one, you need to tap on phone',
    },
    ru: {
        main: 'Главная',
        tasks: 'Задачи',
        frens: 'Друзья',
        loading: 'Загрузка...',
        daily: 'Доход в день:',
        invite: 'Пригласить друга!',
        restricted: 'You silly one, you need to tap on phone',
    },
};

const i18n = createI18n({
    legacy: false,
    locale: 'en', // Default language
    fallbackLocale: 'ru', // Fallback language
    messages,
});

export default i18n;
