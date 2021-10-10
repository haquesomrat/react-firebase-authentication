import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';


initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked)
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError("Password must be at least 6 Characters.");
      return;
    }
    if (!/^(?=.*[A-Z]).*$/.test(password)) {
      setError('Password must have at least one Uppercase Character.');
      return;
    }
    if (isLogin) {
      processLogin(email, password);
    }
    else {
      createNewUser(email, password);
    }
  }
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => {

      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }

  return (
    <div className="mx-5">
      <form onSubmit={handleRegistration}>
        <h3 className="text-primary">Please {isLogin ? 'Log In' : 'Register'}</h3>

        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName3" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" required />
          </div>
        </div>}

        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Log In' : 'Register'}</button>
        <br />
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Reset Password</button>
      </form >
      <br /><br /><br />
      <div>--------------------------------</div>
      <br /><br /><br />
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div >
  );
}

export default App;
