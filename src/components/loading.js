import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

export default function Loading(props) {
    const [show, setShow] = useState("d-none")
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        props.store.subscribe(() => {
            toggleLoading(props.store.getState().isLoading.isLoading)
        })
    }, [])

    const toggleLoading = (status = false) => {
        if (!(status instanceof Object) && status) {
            setShow('d-block')
            setVisible(true)
        } else {
            setShow('d-none')
            setVisible(false)
        }

    }

    return (
        <>
            <div className={show}
                style={{
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    zIndex: 9999
                }}>
                <ThreeDots
                    wrapperStyle={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    height={100}
                    width={100}
                    radius="9"
                    color="lightblue"
                    ariaLabel="three-dots-loading"
                    wrapperClassName=""
                    visible={visible}
                />
            </div>
        </>
    );
}
