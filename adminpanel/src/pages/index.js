import administration from '../assets/administration.png';
import analytics from '../assets/analytics.png';
import { Link } from "react-router-dom";

{/* Icons made by https://www.freepik.com  */ }

function Index() {
    return (
        <div className='index'>
            <h1>Dashboard</h1>
            <hr />
            <div className="card">
                <Link to="/adminDashboard">
                    <div className="administration">
                        <img src={administration}></img>
                        <p>Administration</p>
                    </div>
                </Link>
            </div>
            <div className="card">
                <Link to="/adminDashboard">
                    <div className="analytics">
                        <img src={analytics}></img>
                        <p>Analytics</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Index;