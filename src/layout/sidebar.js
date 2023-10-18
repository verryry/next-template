import Link from "next/link";
import { handleSessionToken, handleSessionUser } from '@/lib/helper';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AiOutlineHome, AiOutlineFolder } from "react-icons/ai";
import { MdSsidChart } from "react-icons/md";
import { PiSuitcaseLight } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { FiSmartphone } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

export default function Sidebar(props) {
    const store = props.store;
    const router = useRouter()
    const dispatch = useDispatch()
    const getUserData = handleSessionUser('getSession', store, dispatch)

    const menu = [
        {
            label: "Dashboard",
            name: "dashboard",
            icon: <AiOutlineHome style={{ width: "20px", height: "20px", marginBottom: "5px" }} />,
            href: '/dashboard'
        },
        {
            label: "Nenjo Monitoring",
            name: "nenjo",
            icon: <MdSsidChart style={{ width: "20px", height: "20px", marginBottom: "5px" }} />,
            href: '/'
        },
        {
            label: "OMS Administrator",
            icon: <PiSuitcaseLight style={{ width: "20px", height: "20px", marginBottom: "5px" }} />,
            name: "oms",
            href: '/',
            childMenus: [
                {
                    label: "Client Group",
                    name: "client-group",
                    icon: "",
                    href: '/product'
                },
                {
                    label: "Previlege",
                    name: "previlege",
                    icon: "",
                    href: '/dashboard'
                },
                {
                    label: "User Matrix",
                    name: "user-matrix",
                    icon: "",
                    href: '/'
                },
            ]
        },
        {
            label: "OLT Administrator",
            icon: <FiSmartphone style={{ width: "20px", height: "20px", marginBottom: "5px" }} />,
            name: "olt",
            href: '/',
            childMenus: [
                {
                    label: "Client Group",
                    name: "client-group",
                    icon: "",
                    href: '/product'
                },
                {
                    label: "Previlege",
                    name: "previlege",
                    icon: "",
                    href: '/dashboard'
                },
                {
                    label: "User Matrix",
                    name: "user-matrix",
                    icon: "",
                    href: '/'
                },
            ]
        },
        {
            label: "Static Data",
            icon: <AiOutlineFolder style={{ width: "20px", height: "20px", marginBottom: "5px" }} />,
            name: "static-data",
            href: '/',
            childMenus: [
                {
                    label: "Client Group",
                    name: "client-group",
                    icon: "",
                    href: '/product'
                },
                {
                    label: "Previlege",
                    name: "previlege",
                    icon: "",
                    href: '/dashboard'
                },
                {
                    label: "User Matrix",
                    name: "user-matrix",
                    icon: "",
                    href: '/'
                },
            ]
        },
    ]

    const destroySession = () => {
        handleSessionToken('destroy', store, router, '/', dispatch)
        handleSessionUser('destroy', store, dispatch)
    }

    return (
        <>
            <div className="col-auto" style={{ backgroundColor: "blue", backgroundImage: "linear-gradient(to top, #71BF43, #00AA4E, #004E43)" }}>
                <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <Link href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline">Logo</span>
                        </Link>
                        {menu.map(menu =>
                            <li key={menu.label} className="nav-item p-1">
                                <Link href={menu.childMenus ? "#" + menu.name : menu.href} data-bs-toggle={menu.childMenus ? "collapse" : ""} className="nav-link align-middle text-decoration-none text-white" style={{ width: "12vw" }}>
                                    {menu.icon} <span className="mt-4">{menu.label} </span>{menu.childMenus ? <IoIosArrowForward className="ms-3" /> : ""}
                                </Link>
                                {menu.childMenus?.map(childMenu =>
                                    <ul key={childMenu.label} className="collapse nav flex-column mt-2" id={`${menu.name}`} data-bs-parent="#menu">
                                        <li className="px-4" >
                                            <Link href={childMenu.href} className="nav-link px-0 text-decoration-none text-white px-2" style={{ width: "11vw" }}>
                                                <span className="d-none d-sm-inline">{childMenu.label}</span>
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                    <hr />
                    <div className="dropdown pb-4">
                        <a href="#" className="d-flex flex-row align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="d-none d-sm-inline mx-1"><CgProfile style={{ width: "20px", height: "20px", marginBottom: "3px", marginRight: "4px" }} />{getUserData.sessionUser.firstName}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu text-small shadow">
                            <li><a className="dropdown-item" href="#">New project...</a></li>
                            <li><a className="dropdown-item" href="#">Settings</a></li>
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li>
                                <hr className="dropdown-divider"></hr>
                            </li>
                            <li> <button className="dropdown-item" onClick={destroySession}>Logout</button></li>
                        </ul>

                        <span style={{ fontSize: "13px" }}>{getUserData.sessionUser.email}</span>
                    </div>
                </div>
            </div>
        </>
    )
}