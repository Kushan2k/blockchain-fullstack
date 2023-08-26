import { ethers } from "./ethers-6.7.0.js"
import { fundMeABI, fundMeAddress } from "./constant.js"

document.addEventListener("DOMContentLoaded", async () => {
  let provider, singer

  let loginbtn = document.querySelector(".login-btn")
  const fundbtn = document.querySelector("#fund")
  const input = document.querySelector("#value")
  const cBalance = document.querySelector("#c-balance")

  if (typeof window.ethereum == "undefined") {
    showErrordialog(
      "you have not installed any wallteds try installing one!",
      "ER"
    )
  }

  loginbtn.addEventListener("click", async (e) => {
    try {
      window.ethereum.request({ method: "eth_requestAccounts" })
      showErrordialog("Connected!", "SU")
      e.target.innerHTML = "logedin"
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      singer = await provider.getSigner()
      setContractbalance(fundMeAddress, cBalance, provider)
    } catch (error) {
      showErrordialog(error.message, "ER")
    }
  })

  const getbalanceBTn = document.querySelector(".get-balance")
  getbalanceBTn.addEventListener("click", async () => {
    try {
      const balance = await provider.getBalance(singer)
      setAccoutBalance(ethers.formatEther(balance))
    } catch (er) {
      showErrordialog("you need to connect first to a provider", "ER")
    }
  })

  fundbtn.addEventListener("click", async () => {
    const contract = new ethers.Contract(fundMeAddress, fundMeABI, singer)

    try {
      const amount = parseFloat(input.value)

      const ether = ethers.parseEther(amount.toString())

      const tx = await contract.donate({ value: ether })
      await waitTofinishTransaction(tx, provider)
      showErrordialog("Funded!", "SU")
      input.value = ""
      setContractbalance(fundMeAddress, cBalance, provider)
    } catch (er) {
      showErrordialog(er.message, "ER")
    }
  })
})

function showErrordialog(msg, t) {
  let place = document.querySelector(".msg")
  place.innerHTML = msg

  if (t === "ER") {
    place.classList.add("alert-danger")
  } else if (t === "SU") {
    place.classList.add("alert-success")
  }

  if (place.classList.contains("d-none")) {
    place.classList.remove("d-none")
  }

  setTimeout(() => {
    place.classList.add("d-none")
  }, 3000)
}

function setAccoutBalance(value) {
  let ele = document.querySelector("#balance")
  ele.innerHTML = value
}

function waitTofinishTransaction(tx, provider) {
  console.log(`Hash : ${tx.hash}`)

  return new Promise((resolve, reject) => {
    provider.once(tx.hash, (txRecipt) => {
      showErrordialog("Funded! <br>Recipt " + txRecipt, "SU")

      resolve()
    })
  })
}

async function setContractbalance(address, element, provider) {
  const newBalance = await provider.getBalance(address)
  element.innerHTML = parseFloat(ethers.formatEther(newBalance)).toFixed(5)
}
