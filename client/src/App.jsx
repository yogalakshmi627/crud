import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
const[users,setUsers]=useState([]);
const[filteredUsers,setFilteredUsers]=useState([]);
const[isModelOpen,setIsModelOpen]=useState(false);
const[userData,setUserData]=useState({name:"",age:"",city:""});
const getAllUsers=async()=>{
  await axios.get("http://localhost:8000/users")
  .then((res)=>{
   //console.log(res.data)
  setUsers(res.data);
  setFilteredUsers(res.data);
    //console.log(setFilteredUsers(res.data))
  })
  }
useEffect(()=>{
getAllUsers();
},[])

//search
const handleSearchChange=(e)=>{
  const searchText=e.target.value.toLowerCase();
  
 const updatedusers=users.filter((user)=>{
  return(
  user.name.toLowerCase().includes(searchText) ||
  user.city.toLowerCase().includes(searchText)
  )
})
setFilteredUsers(updatedusers)
console.log(updatedusers)
};

//delete
const handleDelete=async(id)=>{
  const isConformed=window.confirm("Are you sure you want to delete this user?");
  if(isConformed){
  await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
    setUsers(res.data);
    setFilteredUsers(res.data);
  })
}
}

//add user detail
const handleAddRecord=()=>{
setUserData({name:"",age:"",city:""});
setIsModelOpen(true);
setUserData(true)
}
//close
const closemodel=()=>{
  setIsModelOpen(false);
  getAllUsers();
}

//  handle data
const handledata=(e)=>{
  setUserData({...userData,[e.target.name]:e.target.value})
}
//submit
const handlesubmit=async(e)=>{
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,
      userData).then((res)=>{
    // console.log(res);
     // setUsers(res.data);
     // setFilteredUsers(res.data);
     getAllUsers();
      setIsModelOpen(false);
    })
  }else{
  await axios.post("http://localhost:8000/users",
    userData).then((res)=>{
  // console.log(res);
    //setUsers(res.data);
   // setFilteredUsers(res.data);
   getAllUsers(); 
   setIsModelOpen(false);
    setUserData({name:"",age:"",city:""});
  })
}
closemodel();
setUserData({name:"",age:"",city:""});
}

//edit
const handleUpdateRecord=(user)=>{
  setUserData(user);
  setIsModelOpen(true);
}

  return (
    <>
      <div className='container'>
        <h3>CRUD Application with React.js</h3>
      <div className='input-search'>
<input type='search' placeholder='Search Text Here' onChange={handleSearchChange}/>
<button className='btn green' onClick={handleAddRecord}>Add Details</button>
      </div>
      <table className="table">
        <thead>
          <tr>
         <th>S.No</th>
          <th>Name</th>
          <th>Age</th>
          <th>City</th>
          <th>Edit</th>
          <th>Delete</th>
          </tr>
        </thead>
        <tbody>
         {filteredUsers && filteredUsers.map((user,index)=>{
          return(<tr key={user.id}>
            <td>{index+1}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td><button  className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
          <td><button  className='btn red' onClick={()=>handleDelete(user.id)} >Delete</button></td>
          </tr>)
         })}
          </tbody>
      </table>
      {isModelOpen &&(
        <div className='model'>
          <div className='model-content'>
            <span className='close' 
            onClick={closemodel}>&times;</span>
           <h2>{userData.id?"Update Record":"Add Record"}</h2>
           <div className="input-group">
            <label htmlFor='name'>Name</label>
            <input type='text' value={userData.name}
            onChange={handledata} placeholder='Enter Name' name='name' id='name'/>
           </div>
           <div className="input-group">
            <label htmlFor='age'>Age</label>
            <input type='number' value={userData.age} 
             onChange={handledata} placeholder='Enter Age' name='age' id='age'/>
           </div>
           <div className="input-group">
            <label htmlFor='city'>City</label>
            <input type='text' value={userData.city} 
             onChange={handledata} placeholder='Enter City' name='city' id='city'/>
           </div>
           <button className='btn green' onClick={handlesubmit}>{userData.id?"Update User":"Add User"}</button>
          </div>
        </div>)}
      </div>
    </>
  )
}

export default App
