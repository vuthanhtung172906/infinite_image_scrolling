import React,{useState,useEffect,useRef} from 'react';

const App = () => {
  const [photos , setPhoto] = useState([]);
  const [pageNumber , setPageNumber] = useState(1);
  const [loading , setLoading] = useState(false);
  const pageEnd = useRef();
  let num = 1;
  const fetchPhotos = async(pageNumber) =>{
    const Access_key = "ZsOVhZU7b-5m7R15pJ9O8jW9PNZ1vJFySLFbgmXFhyQ";
    const res = await fetch(`https://api.unsplash.com/photos/?client_id=${Access_key}&page=${pageNumber}&per_page=10`);
    const data = await res.json();
    setPhoto(p => [...p, ...data]);
    setLoading(true);
  }
  const loadMore = () =>{
    setPageNumber(prevPageNumber => prevPageNumber + 1)
  }
  
  useEffect(()=>{
    fetchPhotos(pageNumber)
  },[pageNumber])
  useEffect(()=>{
    if(loading){
      const observer = new IntersectionObserver(entry=>{
        if(entry[0].isIntersecting){
          num++;
          loadMore();
          if(num>=5){
            observer.unobserve(pageEnd.current)
          }
        }
      },{threshold:1});
      observer.observe(pageEnd.current);
    }
  },[loading, num])
  return (
    <div className="App">
        <h1>Infinite scrolling react hook</h1>
        {
          photos.map((photo,index)=>(
            <div className="photos" key={index}>
              <img src={photo.urls.small} alt=""/>
              <p>{photo.user.first_name + ' ' + photo.user.last_name}</p>
              <span>Like: {photo.user.total_likes}</span>
            </div>
          ))
        }
        <div className="loading">
          <img src="loading.gif" alt=""/>
        </div>
        <h3>{photos.length}</h3>
        <button onClick={loadMore} ref={pageEnd}>Load More</button>
    </div>
  );
}

export default App;
