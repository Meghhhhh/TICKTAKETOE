import React,{useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TopBar from "./components/TopBar";
import Home from "./components/Home";
import Background from "./components/Background";
import FAQs from "./components/FAQs";
import About from "./components/AboutUs";
import NotFound from "./components/NotFound";
import Books from "./components/Books";
import Mybooks from "./components/Mybooks";
import Admin from "./components/Admin";
import PaymentFailed from "./components/PaymentFailed";
import Libadmin from "./components/Libadmin";
import PaymentSuccess from "./components/PaymentSuccess";
import Myresources from "./components/Myresources";
import Addresources from "./components/Addresources";
import Bookmarks from "./components/Bookmarks";
import Feedback from "./components/Feedback";
import Dashboard from "./components/Dashboard";
import { setUser } from "./features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

    useEffect(() => {
      axios
        .get(`/users/api/v1/getUser`, {
          withCredentials: true,
        })
        .then((response) => {
          const { name, email, profilePicture, isAdmin, _id, isLibrarian } =
            response?.data?.data;
          dispatch(
            setUser({ name, email, profilePicture, isAdmin, _id, isLibrarian })
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          console.error("Failed to fetch user details");
          setLoading(false);
        });
    }, [dispatch]);

   const LibRoute = ({ element }) => {
     const { isLoggedIn, isLibrarian } = useSelector((state) => state.user);



     if (loading) {
       return <h2>loading</h2>;
     }
     if (isLoggedIn) {
       if (isLibrarian) {
         return element;
       } else if (!isLibrarian) {
         return <Navigate to="/" />;
       }
       // return element;
     } else {
       return <Navigate to="/auth/login" />;
     }
   };
     const DashRoute = ({ element }) => {
       const { isLoggedIn } = useSelector((state) => state.user);

       if (loading) {
         return <h2>loading</h2>;
       }
       if (isLoggedIn) {

           return element;
      

       } else {
         return <Navigate to="/auth/login" />;
       }
     };
    const PrivateRoute = ({ element }) => {
      const { isLoggedIn, isAdmin } = useSelector((state) => state.user);

      if (loading) {
        return;
      }
      if (isLoggedIn) {
        if (isAdmin) {

          return element;
        } else if (!isAdmin) {

          return <Navigate to="/" />;
        }
        // return element;
      } else {
        return <Navigate to="/auth/login" />;
      }
    };
  return (
    <>
      <Background />
      <Router>
        <div>
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Signup />} />
            <Route path="/paymentfailed" element={<PaymentFailed />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="/myresources" element={<Myresources />} />
            <Route path="/addresources" element={<Addresources />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/books" element={<Books />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/history" element={<Mybooks />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/libadmin" element={<LibRoute element={<Libadmin />}/>} />
            <Route
              path="/admin"
              element={<PrivateRoute element={<Admin />} />}
            />
            <Route
              path="/dashboard"
              element={<DashRoute element={<Dashboard />} />}
            />
            <Route
              path="/admin/*"
              element={<PrivateRoute element={<Admin />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;