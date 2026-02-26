import React from 'react'

function Login() {
  return (
    <div className='bg-[#F4F5FA] shadow-2xl p-5'>
        <div className="card-login">
            <h1 className="text-3xl text-blue-500 font-bold">Welcome Back,Runner!</h1>
            <div className="form-login">
                
                <div className="mt-10 grid grid-rows-1 gap-x-6 gap-y-2 sm:grid-rows-1">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-black">Email Address</label>
                        <div className="mt-2">
                            <input id="first-name" type="text" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-black">Password</label>
                        <div className="mt-2">
                            <input id="first-name" type="password" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <button className='mt-1 w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 font-semibold text-sm'>
                            Login
                        </button>
                    </div>
                </div>
                <p className="text-gray-700 mt-2">
                  Don't have  account?
                  <a href='/register' className="mx-2">Register</a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login