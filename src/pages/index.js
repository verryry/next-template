import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// import styles from './index.module.css'
import axiosException from "@/lib/exceptionMessage";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { handleSessionToken, handleSessionUser, loading, showLoading } from "@/lib/helper";
import { HeadMetaData } from "@/components/headMetaTag";
import { useQuery } from "@tanstack/react-query";

export default function Home(props) {
  const [hidden, setHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const store = props.store;
  const router = useRouter()
  const dispatch = useDispatch()

  const getToken = async (username, password) => {
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'authenticate', {
        username: username,
        password: password,
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      return result.data.id_token;
    } catch (e) {
      // showLoading(dispatch, "hide")
      setIsLoading(false)
      toast.error('Invalide Credentials : ' + axiosException(e), {
        position: 'bottom-left'
      });
    }
  }

  const getUserData = async (token) => {
    try {
      let userData = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + 'account', {
        headers: {
          Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
      })

      if (userData.data.mitras.length > 0) {
        var dataMitra = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + `mitras/mitra-by-code/${userData.data.mitras[0]}`, {
          headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
          }
        })

        userData.data.mitraLabel = `${dataMitra.data.mitraCode} - ${dataMitra.data.mitraName}`
      } else {
        userData.data.mitraLabel = ''
      }

      return userData.data
    } catch (e) {
      // showLoading(dispatch, "hide")
      setIsLoading(false)
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    // showLoading(dispatch, "show")
    const data = new FormData(e.currentTarget);
    const token = await getToken(data.get('username'), data.get('password'))
    const userData = await getUserData(token)

    if (userData) {
      handleSessionUser('add', store, dispatch, userData)
      handleSessionToken('add', store, router, '/dashboard', dispatch, token)
      setIsLoading(false)
    }
  }

  const toggleShow = () => {
    setHidden(prev => !prev)
  }

  useEffect(() => {
    handleSessionToken('checkLogin', store, router, '/dashboard')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeadMetaData
        title="Login Website"
        ogImageUrl="https://cdn.discordapp.com/attachments/1050790741334569091/1151943122117480558/V6_Academy_Banner_Assets.png"
        metaDescription="Data Maintenance"
      />
      <nav className={`navbar navbar-expand-md navbar-light navbarColouring`}>
        <Link className="navbar-brand" href="/">
          <Image
            src="/assets/img/pegadaian.png"
            alt="..."
            className={"imgLogo"}
            width={100}
            height={24}
            priority
          />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">

          </ul>
        </div>
      </nav>
      <div className="container-fluid d-flex justify-content-end align-items-start" style={{ minHeight: 'calc(100vh - 60px)', background: 'url("/assets/img/login-bg.png") no-repeat', backgroundSize: 'cover', backgroundPosition: '100% 50%', backgroundSize: 'cover', padding: '10rem' }}>
        <div className="card float-right" style={{ width: '400px', borderRadius: '10px' }}>
          <div className="card-body" style={{ padding: '60px' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="row mb-4">
                <div className="col-md-12 text-center">
                  <h4 className="font-weight-bold text-muted">Login</h4>
                </div>
              </Form.Group>
              <Form.Group className="row">
                <div className="col-md-12">
                  <FloatingLabel
                    controlId="floatingInput1"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control type="text" name="username" className="formLogin" placeholder="Username" required />
                  </FloatingLabel>
                </div>
              </Form.Group>
              <Form.Group className="row">
                <div className="col-md-12">
                  <FloatingLabel
                    controlId="floatingInput2"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control type={hidden ? "password" : "text"} name="password" placeholder="Password" required />

                    <IconContext.Provider value={{ size: "1.5em", className: "revealPassword" }}>
                      {hidden ? <AiFillEyeInvisible onClick={toggleShow} /> : <AiFillEye onClick={toggleShow} />}
                    </IconContext.Provider>

                  </FloatingLabel>
                  {/* <i className={` ${hidden ? <Horse /> : ""} reveal-password`} onClick={toggleShow} /> */}
                </div>
              </Form.Group>
              <Form.Group className="row mb-1">
                <div className="d-grid offset-md-2 col-md-8">
                  <Button type="submit" size="md" className="btn ">
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Sign In"}
                  </Button>

                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </>
  )
}