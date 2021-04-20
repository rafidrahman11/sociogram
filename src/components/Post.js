import { React, useState, useEffect } from 'react';
import firebase from 'firebase';
import { db } from '../firebase';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import './Post.css';
import { Input, Button } from '@material-ui/core';

function Post({ postId, user, avatar, username, imageUrl, caption }) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");

    useEffect(() => {
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp','asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => ({
                    id: doc.id,
                    comment: doc.data()
                    })
                ));
            })
    }, [postId])

    const postComment = () => {
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                text: comment,
                username: user.displayName,
            });
    }

    return (
        <div className="post">
            <Grid container>
                <Grid item xs={12} sm={6} className="post__container">
                    <Paper >
                        <div className="post__top">
                            <Avatar className="post__avatar" alt={username} src={ avatar } />
                            <h5 className="post__username">{username}</h5>
                        </div>
                        {imageUrl && <img className="post__image" src={imageUrl} alt="post_image" />}
                        <div className="post__bottom">
                            <p className="post__caption">
                                {caption}
                            </p>
                            <div className="post__comments">
                                {
                                    comments.map(({ id, comment }) => (
                                        <p key={id} className="post__comment"><strong>{comment.username}</strong><span className="post__comment__text">{comment.text}</span></p>
                                    ))
                                }
                            </div>
                            {user &&
                                <form className="post__comments__form">
                                <Input
                                    className="post__add__comment"
                                    placeholder="Add Comments..."
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button onClick={postComment}>
                                    Post
                                </Button> 
                            </form>
                            }
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Post
