import './home.css'
import vec from './assets/office.png'

export default function Home(){
    return(
        <>
        <div className="home-main">
            <div className="home-1">
                <h1>Fingine</h1>
                <p><span>AI-Powered </span>Financial Reports & Insights</p>
            </div>
            <div className="home-2">
                <div className="home-2-1">
                    <img src={vec} alt="" />
                    <div className="home-2-1-con">
                        <div className="home-2-p">
                            <p>Say goodbye to manual financial tracking! Automate reports, gain real-time insights, and ensure regulatory compliance effortlessly with Fingine.</p>
                        </div>
                        <div className="b-grad">
                            <button>Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}