Verifiable credential from disco.xyz

```json+vc
{"@context":["https://www.w3.org/2018/credentials/v1"],"type":["VerifiableCredential","OfficialDisconautCredential"],"issuer":{"id":"did:3:kjzl6cwe1jw14a7u9sx3thx9gg9uh7u5tqjkzcnr5pi5zzkap7kiztgsfhzayzt"},"id":"did:3:kjzl6cwe1jw14a7u9sx3thx9gg9uh7u5tqjkzcnr5pi5zzkap7kiztgsfhzayzt#3f3262e6-36a5-4f82-a573-990217a9f33a","credentialSubject":{"id":"did:3:kjzl6cwe1jw1498xgh6ylmkr3xxeussy8ovxcei8bl4oi9j1jv2pp2yikb0sdaq","edition":1},"credentialSchema":{"id":"https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/OfficialDisconautCredential/1-0-0.json","type":"JsonSchemaValidator2018"},"proof":{"verificationMethod":"did:3:kjzl6cwe1jw14a7u9sx3thx9gg9uh7u5tqjkzcnr5pi5zzkap7kiztgsfhzayzt#controller","created":"2023-01-09T13:59:53.080Z","proofPurpose":"assertionMethod","type":"EthereumEip712Signature2021","proofValue":"0x097f96791bcb242de33e722df17e99d4410c3386c424b146d3ae3628291512b930cf1dcb69f275932800a8c638d2587c82ef30420e6c2f16a983094e4689a65e1b","eip712Domain":{"domain":{"chainId":1,"name":"Disco Verifiable Credential","version":"1"},"messageSchema":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"Issuer":[{"name":"id","type":"string"}],"CredentialSubject":[{"name":"id","type":"string"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"id","type":"string"},{"name":"issuanceDate","type":"string"},{"name":"issuer","type":"Issuer"},{"name":"proof","type":"Proof"},{"name":"type","type":"string[]"}]},"primaryType":"VerifiableCredential"}},"updatedAt":"2023-01-09T13:59:53.080Z","isPublic":true,"genId":"70021c29-3f32-486a-a236-09218ea789f7","recipient":"did:3:kjzl6cwe1jw1498xgh6ylmkr3xxeussy8ovxcei8bl4oi9j1jv2pp2yikb0sdaq","issuanceDate":"2023-01-09T13:59:53.080Z"}
```