import {navigate} from "../utility/router.js";


export async function login(loginRequestDTO) {

    const response = await fetch("api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(loginRequestDTO)
    })

    if (response.ok) {
        console.log("User with username: " + loginRequestDTO.username + " was successfully logged in");
        navigate("/home")
    }


}