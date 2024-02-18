import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LoginResponse, SamlResponse } from "./App";

export function SpIniticatedLogin() {
  const [serviceProviderID, setServiceProviderID] = useState<
    number | undefined
  >(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [samlResponse, setSamlResponse] = useState<SamlResponse | undefined>(
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  const submitSamlForm = () => {
    formRef.current && formRef.current.submit();
  };

  const handleSubmit = async () => {
    const authRes = await axios.post<LoginResponse>(
      "http://localhost:3000/auth/login",
      {
        email,
        password,
      }
    );
    const token = authRes.data.token;
    const samlRes = await axios.post<SamlResponse>(
      `http://localhost:3000/saml/create-saml-response`,
      {
        id: serviceProviderID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSamlResponse(samlRes.data);
    setTimeout(submitSamlForm, 1000);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id) {
      setServiceProviderID(parseInt(id));
    }
  }, []);

  return (
    <>
      <h1>SAMLテスト 認証基盤</h1>
      <h2>SPIniticated ログインページ</h2>
      <div>Email: kanta@email.com password: password</div>
      <div>Email: hasegawa@email.com password: password</div>
      <div>上記のどちらかでログインできます</div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="button" onClick={handleSubmit}>
        ログイン
      </button>
      {samlResponse && (
        <form
          ref={formRef}
          target="_blank"
          method="post"
          action={samlResponse.result.entityEndpoint}
        >
          <input
            type="hidden"
            name="SAMLResponse"
            value={samlResponse.result.context}
          ></input>
        </form>
      )}
    </>
  );
}
