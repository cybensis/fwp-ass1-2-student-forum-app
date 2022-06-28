import { Link } from "react-router-dom";
import users from '../../assets/users.png';
import posts from '../../assets/posts.png';


function AdminDashboard() {
    return (
        <div className='administration'>
            <h1>Administration Dashboard</h1>
            <hr />
            <div className="card">
                <Link to="/adminDashboard/users">
                    <div className="users">
                        <img src={users}></img>
                        <p>User options</p>
                    </div>
                </Link>
            </div>
            <div className="card">
                <Link to="/adminDashboard/posts">
                    <div className="posts">
                        <img src={posts}></img>
                        <p>Post options</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default AdminDashboard;