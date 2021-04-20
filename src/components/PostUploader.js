import { React, useState } from 'react';
import firebase from 'firebase';
import { Grid, Paper, Input, Button } from '@material-ui/core';
import { db, storage } from '../firebase';
import "./PostUploader.css";

function PostUploader({ user }) {
    const [caption,setCaption] = useState("");
    const [progress,setProgress] = useState(0);
    const [image,setImage] = useState(null);

    const handlefile = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: user.displayName,
                        })
                    })
            }
        )
    }

    return (
        <div className="postUploader">
            <Grid container>
                <Grid item xs={12} sm={6} className="postUploader__container">
                    <Paper className="postUploader__paper">
                        <center>
                            <form>
                                <div className="postUploader__top">
                                    <p>Upload Image: </p>
                                    <Input
                                        className="postUpload__image"
                                        type="file"
                                        onChange={handlefile}
                                    />
                                    <Input
                                        className="postUploader__caption"
                                        placeholder="Write a caption..."
                                        type="text"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                    <Button variant="contained" color="primary" onClick={handleUpload} >Post</Button>
                                </div>
                            </form>
                            <div className="postUploader__bottom">
                                <p>Progress: </p>
                                <progress className="postUploader__progress" value={progress} max="100"></progress>
                            </div>
                        </center>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default PostUploader
