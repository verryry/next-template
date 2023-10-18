import Link from 'next/link';
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function Layout({ store, children }) {
    return (
        <>
            <div className='d-flex flex-row'>
                <div style={{ width: "14%", height: "100vh" }}>
                    <Sidebar store={store} />
                </div>
                <div className="d-flex flex-column ">
                    <div style={{ backgroundImage: "linear-gradient(to left, #71BF43, #00AA4E, #004E43)", width: "86vw", height: "5vh" }}>
                        <Navbar store={store} />
                    </div>
                    <div style={{ width: "86vw", height: "95vh" }}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}