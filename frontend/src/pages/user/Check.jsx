import axios from "axios"
function Check() {
  const handleclick = async()=>{
    const response = await axios.post('http://localhost:8000/api/test', {}, {
            withCredentials: true // Include cookies
        });
        console.log(response)
  }
  return (
    <div>
      <button onClick={handleclick}>asdasdas</button>
    </div>
  )
}

export default Check
