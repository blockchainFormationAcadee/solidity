const fs = require('fs');
const { compile } = require('./compile.test');

const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const mocha = require('mocha');
const assert = require('assert');

mocha.describe('Enum - Exercice 08', () => {
    const contractName = 'Enum';
    let accounts = undefined;
    let contract = undefined;

    mocha.beforeEach(async () => {
        const { abi, bytecode } = compile(contractName, {
            'Enum.sol': {
                content: fs.readFileSync('./exercices/ex08 - Enum/sources/' + contractName + ".sol", "utf-8")
            }
        });
        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(abi)
            .deploy({data: bytecode.object.toString()})
            .send({from: accounts[0], gas: 3000000});
    });
    mocha.it('has been deployed', () => {
        assert.ok(contract.options.address);
    });
    mocha.it('OWNER enum is good', async () => {
        await contract.methods.setAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138", "0").send({from: accounts[0]});
        const getAddressType = await contract.methods.getAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138").call();

        assert.equal(getAddressType, "0");
    });
    mocha.it('CUSTOMER enum is good', async () => {
        await contract.methods.setAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138", "1").send({from: accounts[0]});
        const getAddressType = await contract.methods.getAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138").call();

        assert.equal(getAddressType, "1");
    });
    mocha.it('FRIEND enum is good', async () => {
        await contract.methods.setAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138", "2").send({from: accounts[0]});
        const getAddressType = await contract.methods.getAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138").call();

        assert.equal(getAddressType, "2");
    });
    mocha.it('DEVELOPER enum is good', async () => {
        await contract.methods.setAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138", "3").send({from: accounts[0]});
        const getAddressType = await contract.methods.getAddressType("0xd9145CCE52D386f254917e481eB44e9943F39138").call();

        assert.equal(getAddressType, "3");
    });
});
