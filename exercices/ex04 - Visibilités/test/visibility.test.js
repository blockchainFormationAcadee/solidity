const fs = require('fs');
const { compile } = require('./compile.test');

const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const mocha = require('mocha');
const assert = require('assert');

mocha.describe('Visibilité - Exercice 04', () => {
    const contractName = 'Visibility';
    let accounts = undefined;
    let contract = undefined;

    mocha.beforeEach(async () => {
        const { abi, bytecode } = compile(contractName, {
            'Visibility.sol': {
                content: fs.readFileSync('./exercices/ex04 - Visibilités/sources/' + contractName + ".sol", "utf-8")
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
    mocha.it('all visibilities are good', async () => {
        const answerToLife = await contract.methods.answerToLife().call();
        const wrongAnswerToLife = await contract.methods.wrongAnswerToLife().call();

        assert.equal(answerToLife, 42);
        assert.equal(wrongAnswerToLife, -42);
    });
});
