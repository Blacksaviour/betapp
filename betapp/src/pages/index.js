import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import styles from "../styles/Home.module.css";
import { Address, abi } from "../constants";

export default function App() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [betTeam, setBetTeam] = useState(0);
  const [winningTeam, setWinningTeam] = useState(0);
  const [result, setResult] = useState(null);

  const handleConnect = async () => {
    const providerOptions = {
      /* see: https://docs.web3modal.com/#available-providers */
    };
    const web3Modal = new Web3Modal({
      providerOptions
    });
    const provider = await web3Modal.connect();
    setWeb3Provider(provider);
  };

  const handleBet = async () => {
    if (!web3Provider) {
      console.error("Web3 provider not set");
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
  
    const contract = new ethers.Contract(Address, abi, signer);

    if (betAmount <= 0) {
      alert("Please enter a positive bet amount.");
      return;
    }


    // check if betAmount is a valid number
    const betAmountInt = parseInt(betAmount);
    if (isNaN(betAmountInt)) {
      setResult(`Error: Bet amount is not a valid number`);
      return;
    }
  
    try {
      const betAmountInUnits = ethers.utils.parseUnits(betAmount.toString(), 18);
      const tx = await contract.bet(betTeam, { value: betAmountInUnits });
      const receipt = await tx.wait();
      console.log(receipt);
      setResult(`Successfully placed bet! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(error);
      setResult(`Error placing bet: ${error.message}`);
    }
  };

  const providerOptions = {
    metamask: {
      provider: typeof window !== 'undefined' ? window.ethereum : null,
      options: {
        network: 'goerli' // Replace with the desired network
      }
    }
  };
  
 
  
  const handleDistributePrizes = async () => {
    if (!web3Provider) {
      console.log('Web3 provider not found');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
  
    const contract = new ethers.Contract(Address, abi, signer);
    try {
      const tx = await contract.distributePrizes(winningTeam);
      const receipt = await tx.wait();
      console.log(receipt);
      setResult(`Successfully distributed prizes! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(error);
      setResult(`Error distributing prizes: ${error.message}`);
    }
  };

  return (
    <div className={styles.container} >
      
      <button onClick={handleConnect} style={{ marginLeft: "auto" }}>Connect Wallet</button>


      <h2>Place a bet</h2>
      <label>
        Bet amount:
        <input type="number" step="0.01" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} />
      </label>
      <br />
      <label>
        Bet team:
        <select value={betTeam} onChange={(e) => setBetTeam(Number(e.target.value))}>
          <option value={0}>--</option>
          <option value={1}>Team 1</option>
          <option value={2}>Team 2</option>
        </select>
      </label>
      <br />
      <button onClick={handleBet}>Place Bet</button>

      <h2>Distribute prizes</h2>
      <label>
        Winning team:
        <select value={winningTeam} onChange={(e) => setWinningTeam(Number(e.target.value))}>
          <option value={0}>--</option>
          <option value={1}>Team 1</option>
          <option value={2}>Team 2</option>
        </select>
      </label>
      <br />
      <button onClick={handleDistributePrizes}>Distribute Prizes</button>

      {result && <p>{result}</p>}
    </div>
  );
}

