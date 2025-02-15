const FeedAdd = () => {
  const onSubmitHandler = () => {
    
  }
  return <>
  <div>
    <form onSubmit={onSubmitHandler}>
      <input type="text" placeholder="제목"></input>
      <input type="text"></input>
      <input type="text" placeholder="내용"></input>
      <button>포스팅</button>
    </form>
  </div>
  </>
};

export default FeedAdd;
