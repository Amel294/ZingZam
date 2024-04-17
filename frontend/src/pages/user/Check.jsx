import AxiosWithBaseURLandCredentials from "../../axiosInterceptor";
function Check() {
  const handleclick = async()=>{
    const response = await AxiosWithBaseURLandCredentials.post('/api/test', {}, {
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
