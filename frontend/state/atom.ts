import { atom } from 'recoil';

export const logedinState = atom<boolean>({
  key: 'logedinState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const adminState = atom<boolean>({
    key: 'adminState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const userID = atom<string>({
    key: 'userID', // unique ID (with respect to other atoms/selectors)
    default: ""
});

export const  userName = atom<string>({
    key: 'userName', // unique ID (with respect to other atoms/selectors)
    default: ""
});

export const  userEmail = atom<string>({
    key: 'userEmail', // unique ID (with respect to other atoms/selectors)
    default: ""
});

export const  userCourse = atom<string>({
    key: 'userCourse', // unique ID (with respect to other atoms/selectors)
    default: ""
});