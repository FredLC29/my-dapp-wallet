import { useState, useCallback, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import Web3 from 'web3'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState(0)
  const [web3] = useState(new Web3(Web3.givenProvider || "ws://localhost:8545"))
  const [weiToSend, setWeiToSend] = useState(0)
  const [addressToSend, setAddressToSend] = useState("")
  const [providerName, setProviderName] = useState("")

  const connectToWeb3 = useCallback(
    async () => {
      if(window.ethereum) {
        try {
          await window.ethereum.request({method: 'eth_requestAccounts'})

          setIsConnectedWeb3(true)
        } catch (err) {
          console.error(err)
        }
      } else {
        alert("Install Metamask")
      }
    }
  )

  useEffect(() => {
    const getAccounts = async () => setAccounts(await web3.eth.getAccounts())
    const getBalance = async () => {
      const balanceWEI = web3.eth.getBalance(accounts[0])
      setBalance( web3.utils.fromWei((await balanceWEI).toString(),'Ether'))
    }

    const getProviderName = async () => setProviderName(await web3.eth.net.getNetworkType())

    if (accounts.length == 0) getAccounts()
    if (accounts.length > 0) getBalance()
    if (accounts.length > 0) getProviderName()
    }, 
    [isConnectedWeb3, accounts, providerName]
  )

  const sendEth = useCallback(
    async () => {
      await web3.eth.sendTransaction({ 
        from: accounts[0], 
        to: addressToSend, 
        value: web3.utils.toWei(weiToSend, 'ether')})
    },
    [accounts, addressToSend, weiToSend]
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <h1> Wallet dApp </h1>
        
        <div className={styles.provider}>
          <p className={styles.providerName}>{providerName}</p>
          {
            isConnectedWeb3
              ? <p><a href={`https://${providerName}.etherscan.io/address/${accounts[0]}`} target="_blank"><img src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png" alt='Etherscan' className={styles.imgEth}></img></a></p>
              : <button onClick={connectToWeb3} className={styles.button}>Connect to web3</button>
          }
        </div>

        <div className={styles.sendEth}>
          <p>Amount Ethers : {balance} Eth</p>
          <div><label>Address :</label> <input type="number" onChange={e => setWeiToSend(e.target.value)} placeholder="Eth" /></div>
          <div><label>Amount :</label> <input type="text" onChange={e => setAddressToSend(e.target.value)} placeholder="address" /></div>
          <button onClick={sendEth} className={styles.button}>Envoyer</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Frédéric LE COIDIC</p>
        <a href="https://github.com/FredLC29/my-dapp-wallet" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" title="GitHub" className={styles.imgEth}>
        </img></a>
      </footer>
    </div>
  )
}
