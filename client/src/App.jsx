import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);



  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        signature={signature}
        setSignature={setSignature}
        recoveryBit = {recoveryBit}
        setRecoveryBit ={setRecoveryBit}
      />
      <Transfer setBalance={setBalance} signature={signature} recoveryBit={recoveryBit} />
    </div>
  );
}

export default App;
