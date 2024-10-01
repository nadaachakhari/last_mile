import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'


import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
//Register pour fournisseurs
const Register = React.lazy(() => import('./pages/admin/Tiers/supplier_registration.js'))


//authenticate

const Authenticate = React.lazy(() => import('./pages/admin/Authenticate/authenticate'))
const Request_reset_password = React.lazy(() => import('./pages/admin/Authenticate/request_reset_password'))
const Reset_password = React.lazy(() => import('./pages/admin/Authenticate/reset_password'))
const Changer_mot_passe2= React.lazy(() => import('./pages/admin/Authenticate/new_password'))
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
         
          <Route exact path="/register" name="Register Page" element={<Register />} />
       
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route exact path="/authenticate" name="Login Page" element={<Authenticate />} />
          <Route exact path="/request_reset_password" name="" element={<Request_reset_password />} />
          <Route exact path="/reset_password/:token" name="" element={<Reset_password />} />
          <Route exact  path= '/profil/changer_motpasse/:token' element= {<Changer_mot_passe2/> }/>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App