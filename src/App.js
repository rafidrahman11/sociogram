import './App.css';
import Navbar from './components/Navbar';
import Post from './components/Post';
import PostUploader from './components/PostUploader';
import { useState, useEffect } from 'react';
import { db, auth } from './firebase';

function App() {
  const [posts,setPosts] = useState([]);
  const [currentUser,setCurrentUser] = useState(null);

  useEffect(() => {
      db
      .collection('posts')
      .orderBy('timestamp','desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      })
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        setCurrentUser(authUser);
      } else {
        setCurrentUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [currentUser])

  return (
    <div className="app">
      <Navbar />
      {currentUser &&
        <PostUploader user={currentUser}/>
      }
      {
      posts.map(({ id, post }) => (
        <Post key={id} postId={id} user={currentUser} avatar={post.avatar} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
      ))
      }
    </div>
  );
}

export default App;
