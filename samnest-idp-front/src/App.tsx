import axios from "axios";
import { useEffect, useState } from "react";
import xmlFormat from "xml-formatter";
import { CopyBlock, atomOneLight } from "react-code-blocks";

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SamlResponse {
  result: {
    id: string;
    context: string;
    entityEndpoint: string;
    type: string;
  };
}

export interface ServiceProvider {
  id: number;
  name: string;
  entityID: string;
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [current, setCurrent] = useState<LoginResponse["user"] | undefined>(
    undefined
  );
  const [serviceProviders, setServiceProviders] = useState<
    ServiceProvider[] | undefined
  >(undefined);
  const [samlResponse, setSamlResponse] = useState<SamlResponse | undefined>(
    undefined
  );
  const [formatContext, setFormatContext] = useState<string>("");

  const handleSubmit = async () => {
    const res = await axios.post<LoginResponse>(
      "http://localhost:3000/auth/login",
      {
        email,
        password,
      }
    );
    setToken(res.data.token);
    setCurrent(res.data.user);
  };

  const handleLogout = () => {
    setToken("");
    setCurrent(undefined);
  };

  const handleSamlLogin = async (id: number) => {
    const res = await axios.post<SamlResponse>(
      `http://localhost:3000/saml/create-saml-response`,
      {
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSamlResponse(res.data);
    const decodedContext = atob(res.data.result.context);
    setFormatContext(xmlFormat(decodedContext));
  };

  useEffect(() => {
    const fetchServiceProviders = async () => {
      const res = await axios.get<ServiceProvider[]>(
        "http://localhost:3000/saml/service-providers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServiceProviders(res.data);
    };
    if (token) {
      fetchServiceProviders();
    }
  }, [token]);

  return (
    <>
      <head>
        <title>認証基盤</title>
      </head>
      <h1>SAMLテスト 認証基盤</h1>
      {!token ? (
        <>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSubmit}>
            ログイン
          </button>
        </>
      ) : (
        <>
          <div>ログイン済み: {current?.name}</div>
          <button type="button" onClick={handleLogout}>
            ログアウト
          </button>
          <h2>サービスプロバイダ一覧</h2>
          <ul>
            {serviceProviders && (
              <ul>
                {serviceProviders.map((sp) => (
                  <li key={sp.id}>
                    <div>{sp.name}</div>
                    <div>{sp.entityID}</div>
                    <button
                      type="button"
                      onClick={() => handleSamlLogin(sp.id)}
                    >
                      SAMLレスポンスを取得
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ul>
          {
            <div>
              <h2>SAMLレスポンス</h2>
              {samlResponse && (
                <>
                  <div>
                    エンドポイント: {samlResponse.result.entityEndpoint}
                  </div>
                  <form
                    target="_blank"
                    method="post"
                    action={samlResponse.result.entityEndpoint}
                  >
                    <input
                      type="hidden"
                      name="SAMLResponse"
                      value={samlResponse.result.context}
                    ></input>
                    <input type="submit" value="SAMLレスポンスを送信"></input>
                  </form>
                  <CopyBlock
                    text={formatContext}
                    language="xml"
                    showLineNumbers
                    theme={atomOneLight}
                    codeBlock
                  />
                </>
              )}
            </div>
          }
        </>
      )}
    </>
  );
}

export default App;
