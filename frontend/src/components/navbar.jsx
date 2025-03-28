import './navbar.css'
import Logo from '../assets/fin-logo.png'
export default function Navbar(){
    return(
        <>
        <div className="nav-main">
            <img src={Logo} alt="" />
            <a href="">Dashboard</a>
            <a href="">Analyze</a>
            <a href="">Contact Us</a>
            <a href="">User</a>
        </div>
        </>
    )
}