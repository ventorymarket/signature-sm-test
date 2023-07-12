import { expect } from "chai";
import { Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";


let sample: Contract<FactorySource["Sample"]>;
let signer: Signer;

describe("Test Sample contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const sampleData = await locklift.factory.getContractArtifacts("Sample");

      expect(sampleData.code).not.to.equal(undefined, "Code should be available");
      expect(sampleData.abi).not.to.equal(undefined, "ABI should be available");
      expect(sampleData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      const INIT_STATE = 10;
      const { contract } = await locklift.factory.deployContract({
        contract: "Sign",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
          _state: INIT_STATE,
        },
        value: locklift.utils.toNano(2),
      });
      sample = contract;

      expect(await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Interact with contract", async function () {
      const payload = await sample.methods.setState({_state: 20}).encodeInternal();
      console.log('payload',payload);
      const response = await sample.methods.getState({}).call();
      console.log(response);
      // const testSign = await sample.methods.testSign({
      //   hashText: '0xb434d50276849c94069977b5a6fc8226db137bdc2d3009d9627cff91d2235c3c',
      //   SignHighPart: '0x232ea453d5f85241b665d815ca2eb8ee00d154e2fbc3a5c0abf0efaf41a8710b',
      //   SignLowPart: '0x1046ec5d388241377293d176a6819cd512c32b2ea476a41ed87c81fc9843240d',
      //   pubkey: '0xf8200c318d67fc6a6fba2900f60e07b231fe570b8a1f0bb241e0f9718b60d695'
      // }).call();
      // console.log('testSign', testSign);

      // const dataTVM = await sample.methods.testEncode({}).call();
      // console.log('dataTVM', dataTVM);

      const verifyBoc = await sample.methods.getDataBoc({
        dataCell:'te6ccgEBAQEARQAAhYAC2kkjXqkftwnfJXhAat0Jtl3xc+dpRwvUdeXSBWQ4AtAAW0kka9Uj9uE75K8IDVuhNsu+LnztKOF6jry6QKyHAFo=',
        signature:'te6ccgEBAQEAQgAAgOGupZiyVELJMuWS8ArVLXkxsmZ2qTFctsFZHShQ+D72fhP17xuhixy0QF62m/jruoqTlHTOyDOVu2AVI4p2CAA=',
       // pubKey:'0xf8200c318d67fc6a6fba2900f60e07b231fe570b8a1f0bb241e0f9718b60d695'
      }).call()
      console.log('verifyBoc',verifyBoc)

      //const dataDecode = await sample.methods.decode({ data:'te6ccgEBAQEAVAAAowAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA=' }).call();
      //console.log('dataTVM', dataDecode);
    });

    // it("Interact with contract", async function () {
    //   const NEW_STATE = 1;

    //   await sample.methods.setState({ _state: NEW_STATE }).sendExternal({ publicKey: signer.publicKey });

    //   const response = await sample.methods.getDetails({}).call();
    //   console.log('test', response);
    //   expect(Number(response._state)).to.be.equal(NEW_STATE, "Wrong state");
    //   await locklift.tracing.trace(sample.methods.testFunc({ input: 10 }).sendExternal({ publicKey: signer.publicKey }));
    //   const responseRandom = await sample.methods.genNumber({ limit: 2 }).call();
    //   console.log('responseRandom',responseRandom);
    // });
  });
});
