// Global variables
let web3
let contract
let isContractInitialized = false


const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_producer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_distributor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "markDelivered",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "markInTransit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "producer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "distributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"name": "ProductCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newQuantity",
				"type": "uint256"
			}
		],
		"name": "QuantityUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum SupplyChain.State",
				"name": "newState",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "StateChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newQuantity",
				"type": "uint256"
			}
		],
		"name": "updateQuantity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProductDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.State",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProductHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "enum SupplyChain.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct SupplyChain.StateChange[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productHistory",
		"outputs": [
			{
				"internalType": "enum SupplyChain.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "producer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "distributor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.State",
				"name": "state",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const CONTRACT_ADDRESS = "0x010e86da19f21e2b8f0a8eae5c7de45b97e9d853"

// States Are
const stateNames = {
  0: "Created",
  1: "InTransit",
  2: "Delivered",
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting splash screen animation...")

  // Wait for the fade animation to complete (2 seconds) plus a little extra time
  setTimeout(() => {
    console.log("Splash animation complete, hiding splash screen...")
    const splashScreen = document.getElementById("splash-screen")
    const mainApp = document.getElementById("main-app")

    if (splashScreen) {
      splashScreen.style.opacity = "0"
      splashScreen.style.transition = "opacity 0.5s ease"

      setTimeout(() => {
        splashScreen.style.display = "none"
        if (mainApp) {
          mainApp.classList.remove("hidden")
        }
        console.log("Main app should now be visible")
      }, 500)
    }
  }, 3000) // 2s for the animation + 1s extra viewing time

  // Setup event listeners
  setupEventListeners()

  // Initialize Web3 and contract
  initializeWeb3()
})

// Initialize Web3 connection
async function initializeWeb3() {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask detected")

      // Request account access
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Create Web3 instance
        web3 = new Web3(window.ethereum)
        console.log("Web3 initialized with MetaMask provider")

        // Initialize the contract
        if (typeof CONTRACT_ABI !== "undefined" && typeof CONTRACT_ADDRESS !== "undefined") {
          contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
          isContractInitialized = true
          console.log("Contract initialized successfully")
          showToast("Blockchain connection established", "success")
        } else {
          console.error("Contract ABI or address not found")
          showToast("Contract configuration missing", "error")
        }
      } catch (error) {
        console.error("User denied account access:", error)
        showToast("Please connect your wallet to use this application", "error")
      }
    } else {
      console.log("MetaMask not detected")
      showToast("MetaMask not detected. Please install MetaMask to use this application.", "error")
    }
  } catch (error) {
    console.error("Error initializing Web3:", error)
    showToast("Failed to initialize blockchain connection", "error")
  }
}

// Setup event listeners
function setupEventListeners() {
  // Form submissions
  const forms = [
    { id: "createProductForm", handler: handleCreateProduct },
    { id: "markInTransitForm", handler: handleMarkInTransit },
    { id: "markDeliveredForm", handler: handleMarkDelivered },
    { id: "updateQuantityForm", handler: handleUpdateQuantity },
    { id: "viewDetailsForm", handler: handleViewDetails },
    { id: "viewHistoryForm", handler: handleViewHistory },
  ]

  forms.forEach(({ id, handler }) => {
    const form = document.getElementById(id)
    if (form) {
      form.addEventListener("submit", handler)
    }
  })
}

// Modal functions
function openModal(modalId) {
  // Check if contract is initialized before opening transaction modals
  if (
    !isContractInitialized &&
    (modalId === "createProductModal" ||
      modalId === "markInTransitModal" ||
      modalId === "markDeliveredModal" ||
      modalId === "updateQuantityModal")
  ) {
    showToast("Blockchain connection not established. Please refresh the page and connect your wallet.", "error")
    return
  }

  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  // Reset forms
  const form = document.querySelector(`#${modalId} form`)
  if (form) form.reset()

  // Hide result sections
  const productDetails = document.getElementById("productDetails")
  const productHistory = document.getElementById("productHistory")
  if (productDetails) productDetails.classList.add("hidden")
  if (productHistory) productHistory.classList.add("hidden")
}

// Handle Create Product
async function handleCreateProduct(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  try {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      showToast("Please connect your wallet in MetaMask", "error")
      return
    }

    const productName = document.getElementById("productName").value
    const quantity = document.getElementById("quantity").value
    const producerAddress = document.getElementById("producerAddress").value
    const distributorAddress = document.getElementById("distributorAddress").value
    const retailerAddress = document.getElementById("retailerAddress").value

    showToast("Creating product...", "info")

    const result = await contract.methods
      .createProduct(productName, Number.parseInt(quantity), producerAddress, distributorAddress, retailerAddress)
      .send({ from: accounts[0] })

    showToast("Product created successfully! Your product has been registered on the blockchain.", "success")
    closeModal("createProductModal")

    console.log("Transaction result:", result)
  } catch (error) {
    console.error("Error creating product:", error)
    showToast("Failed to create product: " + error.message, "error")
  }
}

// Handle Mark InTransit
async function handleMarkInTransit(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  try {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      showToast("Please connect your wallet in MetaMask", "error")
      return
    }

    const productId = document.getElementById("transitProductId").value

    showToast("Marking product as in transit...", "info")

    const result = await contract.methods.markInTransit(Number.parseInt(productId)).send({ from: accounts[0] })

    showToast("Product marked as in transit! Status updated on blockchain.", "success")
    closeModal("markInTransitModal")

    console.log("Transaction result:", result)
  } catch (error) {
    console.error("Error marking in transit:", error)
    showToast("Failed to mark in transit: " + error.message, "error")
  }
}

// Handle Mark Delivered
async function handleMarkDelivered(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  try {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      showToast("Please connect your wallet in MetaMask", "error")
      return
    }

    const productId = document.getElementById("deliveredProductId").value

    showToast("Marking product as delivered...", "info")

    const result = await contract.methods.markDelivered(Number.parseInt(productId)).send({ from: accounts[0] })

    showToast("Product marked as delivered! Final status confirmed on blockchain.", "success")
    closeModal("markDeliveredModal")

    console.log("Transaction result:", result)
  } catch (error) {
    console.error("Error marking delivered:", error)
    showToast("Failed to mark delivered: " + error.message, "error")
  }
}

// Handle Update Quantity
async function handleUpdateQuantity(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  try {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      showToast("Please connect your wallet in MetaMask", "error")
      return
    }

    const productId = document.getElementById("updateProductId").value
    const newQuantity = document.getElementById("newQuantity").value

    showToast("Updating quantity...", "info")

    const result = await contract.methods
      .updateQuantity(Number.parseInt(productId), Number.parseInt(newQuantity))
      .send({ from: accounts[0] })

    showToast("Quantity updated successfully! New quantity recorded on blockchain.", "success")
    closeModal("updateQuantityModal")

    console.log("Transaction result:", result)
  } catch (error) {
    console.error("Error updating quantity:", error)
    showToast("Failed to update quantity: " + error.message, "error")
  }
}

// Handle View Details
async function handleViewDetails(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  const productId = document.getElementById("detailsProductId").value

  try {
    showToast("Fetching product details...", "info")

    const result = await contract.methods.getProductDetails(Number.parseInt(productId)).call()

    // Update UI with product details
    document.getElementById("detailId").textContent = productId
    document.getElementById("detailName").textContent = result[0]
    document.getElementById("detailQuantity").textContent = result[1]
    document.getElementById("detailProducer").textContent = result[2]
    document.getElementById("detailDistributor").textContent = result[3]
    document.getElementById("detailRetailer").textContent = result[4]

    // Set state with appropriate styling
    const stateElement = document.getElementById("detailState")
    stateElement.textContent = stateNames[result[5]]

    // Add specific styling based on state
    stateElement.className = "detail-value status-badge"
    if (result[5] == 0) {
      stateElement.style.background = "#6b7280"
    } else if (result[5] == 1) {
      stateElement.style.background = "#f59e0b"
    } else if (result[5] == 2) {
      stateElement.style.background = "#10b981"
    }

    document.getElementById("productDetails").classList.remove("hidden")
    showToast("Product details loaded successfully!", "success")
  } catch (error) {
    console.error("Error fetching details:", error)
    showToast("Failed to fetch product details: " + error.message, "error")
  }
}

// Handle View History
async function handleViewHistory(event) {
  event.preventDefault()

  if (!isContractInitialized) {
    showToast("Contract not initialized. Please refresh the page and try again.", "error")
    return
  }

  const productId = document.getElementById("historyProductId").value

  try {
    showToast("Fetching product history...", "info")

    const result = await contract.methods.getProductHistory(Number.parseInt(productId)).call()

    // Clear previous history
    const historyList = document.getElementById("historyList")
    historyList.innerHTML = ""

    // Add history items
    result.forEach((item, index) => {
      const historyItem = document.createElement("div")
      historyItem.className = "history-item"

      const timestamp = new Date(Number.parseInt(item.timestamp) * 1000)

      historyItem.innerHTML = `
        <div class="history-state">${stateNames[item.state]}</div>
        <div class="history-timestamp">${timestamp.toLocaleString()}</div>
      `

      historyList.appendChild(historyItem)
    })

    document.getElementById("productHistory").classList.remove("hidden")
    showToast("Product history loaded successfully!", "success")
  } catch (error) {
    console.error("Error fetching history:", error)
    showToast("Failed to fetch product history: " + error.message, "error")
  }
}

// Toast notification function
function showToast(message, type = "info") {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  if (toast && toastMessage) {
    toastMessage.textContent = message
    toast.className = `toast ${type}`
    toast.classList.remove("hidden")

    // Auto hide after 5 seconds for longer messages
    const hideDelay = message.length > 50 ? 6000 : 4000
    setTimeout(() => {
      toast.classList.add("hidden")
    }, hideDelay)
  }
}

// Handle chain changes
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload()
  })

  // Handle account changes
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      console.log("Account changed:", accounts[0])
      showToast("Wallet account changed", "info")
    } else {
      console.log("Disconnected from wallet")
      showToast("Wallet disconnected", "error")
    }
  })
}