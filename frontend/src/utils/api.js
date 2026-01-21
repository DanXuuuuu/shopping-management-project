// connect the backend and frontend 

const BASE_URL_API = 'http://localhost:8080/api';

export const signup = async(userData) =>{
    // http request
    const response = await fetch(`${BASE_URL_API}/auth/signup`, {
        method: 'POST',
       
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
};

export const signin = async(userData)=>{
    const response = await fetch(`${BASE_URL_API}/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json(); //dont forget the await 
    return data;
};