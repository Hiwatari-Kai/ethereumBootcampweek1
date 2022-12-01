const secp = require("ethereum-cryptography/secp256k1");
const { toHex,utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKeys = [
    "5be89075eb8239bf2773eb111b0ae7afa289e7785abe915202770d4378eef5d1",
    "f1d52bf0bf07a496e13a13ed601d5c83b2341b5b4277b40990f4bb8f229836c9",
    "23a6e524846f7674efddac92e20c24741cc377ecae558880644400337ee843f2"
]



const msg = ["Peace1", "Peace2", "Peace3"];
function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash
}


async function signMessage(msg,key) {
    const hash = hashMessage(msg);
    const signedMessage = await secp.sign(hash, key, { recovered: true });
    // console.log(toHex(signedMessage[0]) + "-" + signedMessage[1]);
    return signedMessage
}
(async () => {
    for (let i = 0; i < privateKeys.length; i++)
    {
        const signature = await signMessage(msg[i], privateKeys[i]);

        console.log(toHex(signature[0]),signature[1])
        const pubKey = secp.recoverPublicKey(hashMessage(msg[i]), toHex(signature[0]), signature[1]);
        
        console.log(toHex(pubKey));
        // const key = publicKey.slice(1);
        // const hash = keccak256(key);
        // console.log(toHex(hash.slice(-20)));
        
    }
  
    // console.log(toHex(pubKey));
    
})()



// const publicKey = secp.getPublicKey("23a6e524846f7674efddac92e20c24741cc377ecae558880644400337ee843f2");
// console.log(toHex(publicKey));