import React from 'react'
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Login = () => {
    
    const navigate=useNavigate();
    const [formData, setFormData] = useState({      
        email: "",
        password: "",
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/login`,formData,{withCredentials:true})
        .then(result => {
          console.log(result)
          toast.success("🟢 Logged in successfully!");
          navigate('/')
        })
        .catch(err => {
            console.log(err);
            toast.error("❌ Something went wrong.");
      });
      };


  return (
    <form onSubmit={handleSubmit}>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
    </div>
    <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

      <div class="max-w-md mx-auto">
        <div>
          <h1 class="text-2xl font-semibold">Login</h1>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div class="relative">
              <input autocomplete="off" id="email" name="email" type="text" onChange={handleChange} required class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
              <label for="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
            </div>
            <div class="relative">
              <input autocomplete="off" id="password" onChange={handleChange} required name="password" type="password" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
              <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
            </div>
            <div class="relative" type="submit">
              <button class="bg-cyan-500 text-white rounded-md px-2 py-1">Submit</button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
     <button
    onClick={() => {
      window.location.href = `${import.meta.env.VITE_API_URL}/google`;
    }}
    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
  >
    Continue with Google
  </button>
</div>



    </div>
  </div>
</div>
</form>
  )
}

export default Login