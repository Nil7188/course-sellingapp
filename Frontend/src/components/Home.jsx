import React, { useEffect, useState } from 'react'
import logo from "../../public/logo.webp"
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from '../utils/utils';





function  Home  ()  {
  const [courses, setCourses]= useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user && user.token) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, []);
  

 const handleLogout = async () => {
  try {
    await axios.get(`${BACKEND_URL}/user/logout`, {
      withCredentials: true,
    });

    localStorage.removeItem("userInfo");
    setIsLoggedIn(false); // UI instantly update

    toast.success("Logged out");
  } catch (error) {
    toast.error("Logout failed");
  }
};
   


 useEffect(()=>{
   const fetchCourses=async ()=>{
    try {
    const responce=await axios.get(`${BACKEND_URL}/course/courses`,
      {
        withCredentials:true,

      }
    )
    console.log(responce.data.courses);
    setCourses(responce.data.courses)



    } catch (error) {
      console.log("error in fetchCourses",error)

    }
    
  }
  fetchCourses()



 },[])

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };



  return (
        <div  className='bg-gradient-to-r from-black to-blue-950'>
          <div className=' h-screen text-white container mx-auto'>
            {/* Header */}

            <header className='flex items-center justify-between p-6 '>



              <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>



              </div>
              <div className='space-x-4' >
                {isLoggedIn? (
           <button onClick={handleLogout}
           className='bg-transparent text-white py-2 px-4 border  border-white rounded'>
            Logout
           </button>
                ): (<>

           <Link to={"/Login"}
           className='bg-transparent text-white py-2 px-2 border border-white rounded'>

            Login

           </Link>
          
          <Link to={"/signup"}
              className='bg-transparent text-white py-2 px-4 border border-white rounded'>

                Signup
              </Link>
               </> )

             
               }

              </div>

              
              
            </header>

            {/* Main Section */}
            <section className='text-center py-20'>



              <h1 className='text-4xl font-semibold text-orange-500 '>CourseHaven</h1>
        
          <br />
          <p className='text-gray-500'>Sharpen your skills with courses crafted by experts.</p>
          <div className='space-x-4 mt-8'>
            <Link to={"/courses"} className='bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore Courses</Link>
             <Link to= {"https://www.youtube.com/learncodingofficial"} target="_blank" rel="noopener noreferrer" className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>Courses Videos</Link>



          </div>

            </section>
            <section>
               <Slider {...settings}>
                {
                  courses.map((course)=>(
                    <div key={course._id} className='p-4'>
                      <div className='relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105'>
                        <div className='bg-gray-900 rounded-lg overflow-hidden'>
                          <img className='h-32 w-full object-contain' src={course.image.url} />
                          <div className='p-6 text-center'>
                            <h2 className='text-xl font-bold text-white'>{course.title}</h2>
                            <button className='mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'> Enroll Now</button>
                          </div>


                        </div>
                      </div>
                    </div>
                  ))
                }
             
      </Slider>
            </section>

            <hr/>

            {/* Footer */}
            <footer className='my-8'>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='flex flex-col items-center md:items-start'>
                   <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>



              </div>
              <div className='mt-3 ml-2 md:ml-6'>
                <p className='mb-2'>Follow us</p>
                <div className='flex space-x-4'><a href=""></a><FaFacebook className='text-2xl hover:text-blue-400' />
<a href=''></a><FaInstagram className='text-2xl hover:text-pink-600' />
<a href=""></a><FaTwitter className='text-2xl hover:text-blue-600' /></div>
              </div>
                </div>



                <div className='items-center flex flex-col'>

                  <h3 className='text-lg font-semibold mb-4'>Connect </h3>
                  <ul className='space-y-2 text-gray-400'> 
                    <li className='hover:text-white cursor-pointer duration-300'>youtube- learn coding</li>
                    <li className='hovetext-white cursor-pointer duration-300'>telegram- learn coding</li>
                    <li className='hover:text-white cursor-pointer duration-300'>Github- learn coding</li>
                  </ul>



                </div>
                <div>
                   <div className='items-center flex flex-col'>

                  <h3 className='text-lg font-semibold mb-4'>Copyrighys &#169; 2026 </h3>
                  <ul className='space-y-2 text-gray-400'> 
                    <li className='hover:text-white cursor-pointer duration-300'>Terms & Conditions</li>
                    <li className='hover:text-white cursor-pointer duration-300'>Privacy Policy</li>
                    <li className='hover:text-white cursor-pointer duration-300'>Refund & Cancellation</li>
                  </ul>



                </div>
                </div>




              </div>




            </footer>


        </div>
    </div>
  )
}

export default Home
