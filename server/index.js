const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes,toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// balances associated with public keys
const balances = {
  "044b3643629ff1e6dfcbd8fed33719b8b4a395a78af3309fb72f6020d7c2d3ba6468fe8c23edb258642352fa6b4d82fe82fea3a90fc5a44ae1a19fbbcde56ba734": 100,
  "04de9a688f367349916707e6c2a453a3e8181a12073868bcb201e99c7fc275f3f5ab49fc4dd8a5657b35f9a153e12f2992db8a215b9fd6a79af3d6da6bd9320301": 50,
  "045e55d770e593cbb96d7d5f6a1dec7e8173cdf34caf2d9380a0b190d6e4d4dd463a50e948524278d9804008e73dc0245e60f0477986d3a800fab092c06aace030": 75,
};

// signatures associated with messages

const record = {
  "304402204f7f431a73f67f34ba46e7a983c9852bdb0902c368e8af65f095d7a0427354e00220600dce99e533b7cb94a57c051998b477eba13e6402345e719b35dace6458bae6": "Peace1",
  "304402202cca78a51ed02e1194c380b75f49984f286493714a6261d9d1919c8a405de61c0220415da2ecde2849ce12dbdd1b581fcbd167e4cf985399c39f27a87c8617232f22": "Peace2",
  "30450221008ff8a76ced39be5fc5fbcc7f0567f711350f758433db10fa22371218c2e8c3b902207f6fb2209111ebd6f7c4db2b829d98c6ebd74a7fe5b551b4b08875f9deefa122": "Peace3",
};


app.get("/balance/:signature/:recoveryBit", (req, res) => {
  const { signature, recoveryBit } = req.params;
  // console.log(signature, recoveryBit);
  
  const pubKey = toHex(secp.recoverPublicKey(hashMessage(record[signature]), signature, parseInt(recoveryBit)));
  console.log(pubKey);
  const balance = balances[pubKey] || 0;
  res.send({ balance });
});



app.post("/send", (req, res) => {
  const { signature, recipient, amount ,recoveryBit} = req.body;
  // console.log(signature)
  if (!record[signature])
    res.status(400).send({message:"No Signature found!!"})
  const pubKey = toHex(secp.recoverPublicKey(hashMessage(record[signature]), signature, parseInt(recoveryBit)));
        
  // console.log(toHex(pubKey));
  setInitialBalance(pubKey);
  setInitialBalance(recipient);
  if (balances[pubKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[pubKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[pubKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(pubKey) {
  if (!balances[pubKey]) {
    balances[pubKey] = 0;
  }
}
function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash
}

