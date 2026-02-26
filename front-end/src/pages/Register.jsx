import React from 'react'

function Register() {
  return (
     <div className='bg-[#F4F5FA] shadow-2xl p-5'>
        <div className="card-login">
            <h1 className="text-3xl text-blue-500 font-bold">Create Account</h1>
            <div className="form-login">
                
                <div className="mt-10 grid grid-rows-1 gap-x-6 gap-y-2 sm:grid-rows-1">
                    <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-black">Email Address</label>
                        <div className="mt-2">
                            <input id="first-name" type="text" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-black">Firstname</label>
                        <div className="mt-2">
                            <input id="first-name" type="text" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-black">Lastname</label>
                        <div className="mt-2">
                            <input id="last-name" type="text" name="last-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-black">Password</label>
                        <div className="mt-2">
                            <input id="first-name" type="password" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-black">Confirm Password</label>
                        <div className="mt-2">
                            <input id="first-name" type="password" name="first-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <button className='mt-1 w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 font-semibold text-sm'>
                            Register
                        </button>
                    </div>
                </div>
                <p className="text-gray-700 mt-2">
                  Already the account?
                  <a href='/login' className="mx-2">Login</a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Register