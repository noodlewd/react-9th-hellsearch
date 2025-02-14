import React, { useEffect, useState } from 'react'
import supabase from './supabase/client'

const FeedContent = () => {
  const [like,setLike] = useState(0);
  const [istoggled,setIsToggled] = useState(false);

  // feed 테이블에서 userid를 가진 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const { data: feeds, error } = await supabase
  .from('feeds')
  .select('*')
  if(error){
    console.error('Error fetching data:',error)
  } 
    }
  fetchData();
  }, [])

  const likeBtnHandler = () => {
    setIsToggled(prevState => !prevState);
  }
  

  return (
    <div key={feeds.user_id}>
        <p>{feeds.nickname}</p>
        <img src={feeds.content_img} alt="" />
        <div>
          <p>{feeds.title}</p>
          {like}
          <button onClick={likeBtnHandler}>
            {istoggled ? '꺼짐':'켜짐'}
            </button>
          <button>댓글 달기</button>
        </div>
        <button>...(수정,삭제)</button>
    </div>
  )
}


export default FeedContent

