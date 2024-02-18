import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

function App() {
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(undefined);

  const handleLogout = () => {
    setToken("");
    setUser(undefined);
    window.history.pushState(null, "", window.location.href.split("?")[0]);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      setToken(token);
    }
  }, []);
  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      const user = await axios.get<User>("http://localhost:3001/auth/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(user.data);
    };
    fetchUser();
  }, [token]);
  return (
    <>
      <h1>SAMLテスト サービスプロバイダ1</h1>
      {user ? (
        <div>
          <h2>ログインユーザー</h2>
          <p>ユーザーID: {user.id}</p>
          <p>名前: {user.username}</p>
          <p>メールアドレス: {user.email}</p>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : (
        <div>
          <a href="http://localhost:3001/saml/samnest-idp/acs/login">
            SAMLログイン
          </a>
        </div>
      )}
    </>
  );
}

export default App;
