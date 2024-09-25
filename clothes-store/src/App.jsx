import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home.jsx'
import ClickItems from './Home/ClickItems.jsx'
import LayoutPage from './Home/LayoutPage.jsx'
import LayoutLogin from './Login/LayoutLogin.jsx'
import Login from './Login/Login.jsx'
import SignUp from './Login/SignUp.jsx'
import Forgot from './Login/Forgot.jsx'
import Identify from './Login/Identify.jsx'
import Resetpassword from './Login/Resetpassword .jsx'
import Fav from './Home/Fav.jsx'
import Cart from './Home/Cart.jsx'
import Changepassword from './Login/Changepasswoed.jsx'
import Profile from './Home/Profile.jsx'
import Add from './Home/Add.jsx'

const App = () => {
    return (
        <Routes>
            <Route path='' element={<Home />} />
            <Route path='/login' element={<LayoutLogin />}>
                <Route path='' element={<Login />} />
                <Route path='/login/forgot' element={<Forgot />} />
                <Route path='/login/forgot/identify' element={<Identify />} />
                <Route path='/login/forgot/identify/resetpassword' element={<Resetpassword />} />
            </Route>
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/infor-item' element={<LayoutPage />}>
                <Route path='' element={<ClickItems />} />
                <Route path='/infor-item/favourites' element={<Fav/>}/>
                <Route path='/infor-item/cart' element={<Cart/>}/>
            </Route>
            <Route path='/change-password' element={<Changepassword/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/add-item' element={<Add/>}/>
        </Routes>
    )
}

export default App
