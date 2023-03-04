const fs = require('fs');
const { compile } = require('./compile.test');

const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const mocha = require('mocha');
const assert = require('assert');

mocha.describe('Struct - Exercice 09', () => {
    const contractName = 'Struct';
    let accounts = undefined;
    let contract = undefined;

    mocha.beforeEach(async () => {
        const { abi, bytecode } = compile(contractName, {
            'Struct.sol': {
                content: fs.readFileSync('./exercices/ex09 - Structures/sources/' + contractName + ".sol", "utf-8")
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
    mocha.it('no user created', async () => {
        const getUser = await contract.methods.getUser().call();

        assert.equal(getUser.username, 'Unknown');
        assert.equal(getUser.age, 10);
        assert.equal(getUser.account, '0x0000000000000000000000000000000000000000');
        assert.equal(getUser.grade, '4');
        assert.equal(getUser.isAlive, false);
    })
    mocha.it('user has been added', async () => {
        await contract.methods.addUser("username", 10).send({from: accounts[0], gas: 3000000});
        const getUser = await contract.methods.getUser().call();

        assert.equal(getUser.username, "username");
        assert.equal(getUser.age, 10);
        assert.equal(getUser.account, accounts[0]);
        assert.equal(getUser.grade, '4');
        assert.equal(getUser.isAlive, true);
    })
    mocha.it('user has been deleted', async () => {
        await contract.methods.addUser("username", 10).send({from: accounts[0], gas: 3000000});
        await contract.methods.removeUser().send({from: accounts[0], gas: 3000000});
        const getUser = await contract.methods.getUser().call();

        assert.equal(getUser.username, 'Unknown');
        assert.equal(getUser.age, 10);
        assert.equal(getUser.account, '0x0000000000000000000000000000000000000000');
        assert.equal(getUser.grade, '4');
        assert.equal(getUser.isAlive, false);
    })
});
