async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  console.log('signer',signer)
  const { contract: sign, tx } = await locklift.factory.deployContract({
    contract: "Sign",
    publicKey: signer.publicKey,
    initParams: {
      _nonce: locklift.utils.getRandomNonce(),
    },
    constructorParams: {
      _state: 0,
    },
    value: locklift.utils.toNano(5),
  });
  console.log('locklift.utils.toNano(3)',locklift.utils.toNano(1))
  console.log(`Sample deployed at: ${sign.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
