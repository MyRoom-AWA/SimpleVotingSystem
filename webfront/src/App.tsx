import React, { useEffect, useState } from "react";
import artifact from "./abi/votingSystem.json";
import { ethers } from "ethers";
import { JsonRpcProvider,Contract } from "ethers";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const rpcUrl = "http://localhost:8545";

type Voter = {
    id: string,
    mail: string;
    dest: string;
}
type Candidate = {
    id: string,
    name: string,
    total: string
}

const useContent = (contract: ethers.Contract) => {
    const[votersValue, setVoters] = useState<Voter[]>([]);
    const[candidates, setCandidates] = useState<Candidate[]>([]);
    const[destination, setDest] = useState<string>("");
    const[mail, setMail] = useState<string>("");
    
    useEffect(() => {
        const getVoters = async() => {
            const _voters = [];
            const _voterSum = await contract.voterId();

            for(let i = 0; i < Number(_voterSum); i++){
                const _voter = await contract.voters(i); 
                _voters.push({
                    id: i.toString(),
                    mail: _voter.mail,
                    dest: _voter.dest
                });
            }
            setVoters(_voters);
        } 
        const getCandidates = async() => {
            const candidateSum = await contract.candidateId();
            const _candidates = [];
            for (let j = 0; j < Number(candidateSum); j++){
                const _candidate = await contract.candidates(j);
                _candidates.push({
                    id: j.toString(),
                    name: _candidate.name,
                    total: _candidate.total.toString()
                });
            }
            setCandidates(_candidates);
        }

        getCandidates();
        getVoters();
    },[contract])

    const requestVoting = async() => {
        const tx = await contract.vote(mail, destination)
        await tx.wait();
    };
    const requestTotaling = async() => {
        const tx = await contract.total();
        await tx.wait();
    };
    const updateMailaddress = (e: React.ChangeEvent<HTMLInputElement>) => setMail(e.target.value);
    const updateDestination = (e: React.ChangeEvent<HTMLInputElement>) => setDest(e.target.value);


    return{
        candidates: candidates,
        voters: votersValue,
        requestVoting,
        requestTotaling,
        updateDestination,
        updateMailaddress,
    }
};

const Content = ({contract}) => {
    if(contract == null) return;
    
    const {candidates, voters, requestVoting, requestTotaling,updateDestination,updateMailaddress} = useContent(contract);

    const handleVoting = () => {
        requestVoting();
        window.location.reload();
    }

    const handleTotaling = () => {
        requestTotaling();
        window.location.reload();
    }

    return(
    <div>
        <p>
            <input onChange={updateMailaddress}/>
            <input onChange={updateDestination}/>
            <button onClick={handleVoting}>投票</button>
        </p>
        <p>
            <button onClick={handleTotaling}>集計</button>
        </p>
        <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Candidate Name</td>
                    <td>Bills</td>
                </tr>
            </thead>
            <tbody>
                {candidates.map((t,index) => <tr key ={`candidates.${index}`}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.total}</td>
                </tr>)}
            </tbody>
            <tbody>
                {voters.map((t,index) => <tr key ={`voter.${index}`}>
                    <td>{t.id}</td>
                    <td>{t.mail}</td>
                    <td>{t.dest}</td>
                </tr>)}
            </tbody>
        </table>
    </div>)
};

export const App = () => {
    const [contract, setContract] = useState<Contract>(null);

    useEffect(()=>{
        const initContract = async () =>{
            try{
                const provider = new JsonRpcProvider(rpcUrl);
                const signer = await provider.getSigner();
                const initContract = new Contract(contractAddress, artifact.abi, signer);
                setContract(initContract);
            }catch(error){
                console.log("Fail to connect contract");
                console.log(error);
            }
        }
        initContract();
    },[]);

    return(
    <div>
        <h1>シンプルな投票システム</h1>
        {contract ? <Content contract = {contract}/> : <p>Connecting to contract...</p>}
    </div>
    )
}