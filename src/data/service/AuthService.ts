import Cookies from "js-cookie";
import FetchUtils from "../../utility/FetchUtils"; 
import { UserEntity } from "../entity/UserEntity";
import { BASE_URL, HOME_URL } from "../../Constant";

class AuthService {
    static async login(username: string, password: string) {
        if (username === '' || password === '') throw Error("Username and password are required!");
        try {
            let resp = await fetch(`${BASE_URL}/api/v1/users/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            const body = await resp.json();
            body.status = resp.status;
            if (body.status !== 200) {
                Cookies.remove("access_token");
                throw Error(body.message);
            } else {
                if (body.data.access_token == null) throw Error(body.message);
                console.log("Login Success");
                Cookies.set("access_token", body.data.access_token);
                return new UserEntity({ username: body.data.username, role: body.data.role })
            }
        } catch (error) {
            Cookies.remove("access_token");
            throw error;
        }
    }

    static async refreshLogin() {
        if (Cookies.get("access_token") == null) return;
        try {
            const resp = await FetchUtils.fetchAuth(
                `${BASE_URL}/api/v1/users/refresh`, 
                { method: "POST" });
            if (resp.status !== 200) throw new Error("TOKEN EXPIRED");

            console.log("Token Refreshed");
            Cookies.set("access_token", resp.data.access_token);
            return new UserEntity({ username: resp.data.username, role: resp.data.role });
        } catch (error) {
            Cookies.remove("access_token");
            throw error;
        }
    }

    static async changePass(password: string, newpassword: string) {
        let resp = await FetchUtils.fetchAuth(`${BASE_URL}/api/v1/auth/change_pass`, {
            method: "POST",
            body: JSON.stringify({ password: password, newpassword: newpassword })
        });
        if (resp.status !== 200) throw Error(resp.message);
        return resp;
    }

    static async logout() {
        window.location.href = HOME_URL;
        Cookies.remove("access_token");
    }
}

export { AuthService }