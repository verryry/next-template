import { HeadMetaData } from '@/components/headMetaTag';
import { autoLogout, handleSessionToken, handleSessionUser } from '@/lib/helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Dashboard(props) {

    const { store } = props;
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        handleSessionToken('checkSession', store, router, '/')
        autoLogout(process.env.NEXT_PUBLIC_TIMEOUT_LOGOUT, store, router, dispatch)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <HeadMetaData
                title="Dashboard"
                ogImageUrl="https://cdn.discordapp.com/attachments/1050790741334569091/1151943122117480558/V6_Academy_Banner_Assets.png"
                metaDescription="Data Maintenance"
            />
            <div>Dasboard</div>
        </>
    )
}