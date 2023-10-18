import { addIsLoading, removeIsLoading } from "@/redux/reducer/isLoading";
import { addSessionToken, removeSessionToken } from "@/redux/reducer/sessionSlice";
import { addSessionUser, removeSessionUser } from "@/redux/reducer/sessionUser";

export function search(value, propName, arrayobject) {
    for (var i = 0; i < arrayobject.length; i++) {
        if (arrayobject[i][propName]) {
            if (arrayobject[i][propName].trim() === value.trim()) {
                return arrayobject[i];
            }
        }
    }
}

export function searchIndex(value, propName, arrayobject) {
    for (var i = 0; i < arrayobject.length; i++) {
        if (arrayobject[i][propName]) {
            if (arrayobject[i][propName].trim() === value.trim()) {
                return i;
            }
        }
    }
}

export const handleSessionToken = (type, store, router, callbackUrl = '', dispatch = '', token = '') => {
    switch (type) {
        case 'add':
            dispatch(addSessionToken(token))
            return router.push(callbackUrl)
            break;
        case 'destroy':
            dispatch(removeSessionToken())
            return router.push(callbackUrl)
            break;
        case 'checkLogin':
            token = store.getState().session.token
            if (token !== '') return router.push(callbackUrl)
            break;
        case 'checkSession':
            token = store.getState().session.token
            if (token === '') return router.push(callbackUrl)
            break;
        default:
            break;
    }
}

export const handleSessionUser = (type, store, dispatch = '', data = {}) => {
    switch (type) {
        case 'add':
            return dispatch(addSessionUser(data))
            break;
        case 'destroy':
            return dispatch(removeSessionUser())
            break;
        case 'getSession':
            data = store.getState().sessionUser
            return data
            break;
        default:
            break;
    }
}

export const showLoading = (dispatch = '', isLoading) => {
    switch (isLoading) {
        case 'show':
            return dispatch(addIsLoading(true))
            break;
        case 'hide':
            return dispatch(removeIsLoading())
            break;
        default:
            break;
    }
}

export const autoLogout = (time, store, router, dispatch) => {
    let timer;
    const events = [
        "load",
        "mousemove",
        "mousedown",
        "click",
        "scroll",
        "keypress",
    ];

    const handleLogoutTimer = () => {
        const logoutDelay = time * 60000; // 60 seconds
        const clearTimer = () => {
            clearTimeout(timer);
        };
        const removeEventListener = () => {
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
        const logoutUser = () => {
            destroySession();
            console.log("logout");
        };
        timer = setTimeout(() => {
            clearTimer();
            removeEventListener();
            logoutUser();
        }, logoutDelay);
    };

    const destroySession = () => {
        handleSessionToken('destroy', store, router, '/', dispatch)
        handleSessionUser('destroy', store, dispatch)
    }

    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    return events.forEach((event) => {
        window.addEventListener(event, () => {
            resetTimer();
            handleLogoutTimer();
        });
    });
}