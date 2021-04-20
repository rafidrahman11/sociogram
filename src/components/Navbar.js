import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Modal, Button } from '@material-ui/core';
import { auth } from "../firebase";
import './Navbar.css';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      width: '70%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    input: {
      marginBottom : '20px',
    }
  }));

function Navbar() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [user,setUser] = useState("");
    const [signInOpen,setSignInOpen] = useState(false);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      })
      return () => {
        unsubscribe();
      }
    }, [user])

    const signUp = (event) => {
      event.preventDefault();
      
      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

      setOpen(false);
    }

    const signIn = (event) => {

      auth.signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message));

      setSignInOpen(false);
    }

    return (
        <div className="navbar">
            <img className="navbar__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
            <div>
                {!user ? 
                (
                  <div className="navbar__registration">
                    <p className="navbar__signup" onClick={() => setOpen(true)}>Sign Up</p>
                    <p className="navbar__login" onClick={() => setSignInOpen(true)}>Login</p>
                  </div>     
                )
                : (<p className="navbar__logout" onClick={() => auth.signOut()}>Logout</p>)
                }
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
              <form>
                <div style={modalStyle} className={classes.paper}>
                  <img className="navbar__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
                    <Input 
                      className={classes.input}
                      placeholder = "username"
                      type = "text"
                      value = {username}
                      onChange = {(e) => setUsername(e.target.value)}
                      required 
                    />
                    <Input 
                      className={classes.input}
                      placeholder="email"
                      type="email"
                      value= {email}
                      onChange = {(e) => setEmail(e.target.value)}
                      required 
                    />
                    <Input 
                      className={classes.input}
                      placeholder="password"
                      type="password"
                      value= {password}
                      onChange = {(e) => setPassword(e.target.value)}
                      required 
                    />
                    <Button variant="contained" color="primary" onClick={signUp}>
                      Sign Up
                    </Button>
                </div>
              </form>
            </Modal>

            <Modal
                open={signInOpen}
                onClose={() => setSignInOpen(false)}
            >
              <form>
                <div style={modalStyle} className={classes.paper}>
                  <img className="navbar__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo"/>
                    <Input 
                      className={classes.input}
                      placeholder="email"
                      type="email"
                      value= {email}
                      onChange = {(e) => setEmail(e.target.value)}
                      required 
                    />
                    <Input 
                      className={classes.input}
                      placeholder="password"
                      type="password"
                      value= {password}
                      onChange = {(e) => setPassword(e.target.value)}
                      required 
                    />
                    <Button variant="contained" color="primary" onClick={signIn}>
                      Login
                    </Button>
                </div>
              </form>
            </Modal>
        </div>
    )
}

export default Navbar
