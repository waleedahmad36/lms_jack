import React, { useState } from 'react'

const Navbar = () => {
    const [loading,setLoading] = useState(false)
    const handleLogout = async () => {
        setLoading(true)
        try {
            const response  =  await fetch("http://localhost:5000/api/v1/auth/logout",{
                method:"POST",
                credentials:"include"
            })
            if(response.ok){
                window.location.href = "/login"
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
        <h1 className='text-2xl font-bold'>Course Creator</h1>
        <button onClick={handleLogout} className='bg-red-500 px-4 py-2 rounded-md'>
            {loading ? "Logging out..." : "Logout"}
        </button>
    </div>
  )
}

export default Navbar