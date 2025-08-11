// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    // Variables - One for storing the owner address & another for storing the product id.
    address public owner;
    uint public productId;

    // Enum - a fixed values for the product state
    enum State { Created, InTransit, Delivered }

    // Product Structure.
    struct Product {
        string name;
        uint quantity;
        address producer;
        address distributor;
        address retailer;
        State state;
    }
    
    // State Change Structure.
    struct StateChange {
        State state;
        uint timestamp;
    }

    // Data Structures - For the products and for the product_history. Store the records on the basis/index of prod_id.
    mapping(uint => Product) public products;
    mapping(uint => StateChange[]) public productHistory;

    // Events - used across the contract for storing the logs
    event ProductCreated(
        uint productId,
        string name,
        uint quantity,
        address producer,
        address distributor,
        address retailer);
    event StateChanged(uint productId, State newState, uint timestamp);
    event QuantityUpdated(uint productId, uint newQuantity);

    // Modifiers - used across the contract for checking some condition
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier validProduct(uint _productId) {
        require(products[_productId].producer != address(0), "Product does not exist");
        _;
    }

    modifier onlyDistributor(uint _productId) {
        require(msg.sender == products[_productId].distributor, "Only distributor can perform this action");
        _;
    }

    modifier onlyRetailer(uint _productId) {
        require(msg.sender == products[_productId].retailer, "Only retailer can perform this action");
        _;
    }

    // Constructor for assigning the owner address.
    constructor() {
        owner = msg.sender;
    }
  
    // Function for creating the product
    function createProduct(
        string memory _name,
        uint _quantity,
        address _producer,
        address _distributor,
        address _retailer) public onlyOwner {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_producer != address(0) && _distributor != address(0) && _retailer != address(0), "Invalid addresses");

        productId++;
        products[productId] = Product({
            name: _name,
            quantity: _quantity,
            producer: _producer,
            distributor: _distributor,
            retailer: _retailer,
            state: State.Created
        });

        productHistory[productId].push(
            StateChange({
            state: State.Created,
            timestamp: block.timestamp
        })
        );

        emit ProductCreated(productId, _name, _quantity, _producer, _distributor, _retailer);
    }

    // Function for the distributor - changing the state of the product to intransit
    function markInTransit(uint _productId) public validProduct(_productId) onlyDistributor(_productId) {
        products[_productId].state = State.InTransit;

        productHistory[_productId].push(StateChange({
            state: State.InTransit,
            timestamp: block.timestamp
        }));

        emit StateChanged(_productId, State.InTransit, block.timestamp);
    }

    // Function for the retailer - changing the state of the product to delivered
    function markDelivered(uint _productId) public validProduct(_productId) onlyRetailer(_productId) {
        products[_productId].state = State.Delivered;

        productHistory[_productId].push(StateChange({
            state: State.Delivered,
            timestamp: block.timestamp
        }));

        emit StateChanged(_productId, State.Delivered, block.timestamp);
    }

    
    // Function for updating the quantity the product
    function updateQuantity(uint _productId, uint _newQuantity) public onlyOwner validProduct(_productId) {
        require(_newQuantity > 0, "Quantity must be greater than zero");

        products[_productId].quantity = _newQuantity;
        emit QuantityUpdated(_productId, _newQuantity);
    }

    // Function for returning the product details
    function getProductDetails(uint _productId) public view validProduct(_productId) returns (string memory, uint, address, address, address, State)
    {
        Product storage product = products[_productId];
        return (
            product.name,
            product.quantity,
            product.producer,
            product.distributor,
            product.retailer,
            product.state
        );
    }

    // Function for returning the product history
    function getProductHistory(uint _productId) public view validProduct(_productId) returns (StateChange[] memory)
    {
        return productHistory[_productId];
    }
}