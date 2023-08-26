import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"

document.addEventListener("DOMContentLoaded", async () => {
  let provider, singer

  let loginbtn = document.querySelector(".login-btn")
  const account = await window.ethereum.request({ method: "eth_accounts" })

  console.log(ethers)

  if (account.length > 0) {
    loginbtn.innerHTML = "logedin"
    console.log("Connected")
  }

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
