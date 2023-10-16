import { handleSessionToken, handleSessionUser } from '@/lib/helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Dashboard(props) {
    const store = props.store;
    const router = useRouter()
    const dispatch = useDispatch()
    const getUserData = handleSessionUser('getSession', store, dispatch)

    const destroySession = () => {
        handleSessionToken('destroy', store, router, '/', dispatch)
        handleSessionUser('destroy', store, dispatch)
    }

    useEffect(() => {
        handleSessionToken('checkSession', store, router, '/')
    }, [])

    return (
        <>
            <div>
                <button onClick={destroySession}>Logout</button>
            </div>

        </>
    )
}