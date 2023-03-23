Verifiable credential created using [didkit](https://www.spruceid.dev/didkit/didkit-examples/core-functions-cli)

```json+vc
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "id": "urn:uuid:8DCA8B3C-ED7C-4C81-9D00-AD0E8782CD4F",
  "type": ["VerifiableCredential"],
  "credentialSubject": {
    "id": "did:web:community.veramo.io"
  },
  "issuer": "did:key:z6Mko4bCnjYF9m1LZMtK9PtsXowyGGD8prU8CVNZSc9yupLB",
  "issuanceDate": "2023-02-20T14:32:39Z",
  "proof": {
    "type": "Ed25519Signature2018",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:key:z6Mko4bCnjYF9m1LZMtK9PtsXowyGGD8prU8CVNZSc9yupLB#z6Mko4bCnjYF9m1LZMtK9PtsXowyGGD8prU8CVNZSc9yupLB",
    "created": "2023-02-20T14:53:16.478Z",
    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..bGsVrvqLMLSKhWGjEjiaY7cqIdP2ylVkNIPZAAHLDn5jyQg_t4u-9IOVR9gLJtao1tZf0kBr-8FgmC-xocBUBg"
  }
}
```