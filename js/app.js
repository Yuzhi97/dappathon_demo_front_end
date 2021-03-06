console.log("Hello Dappathon!");

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("./js/Malaysia.json", function(malaysia) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Malaysia = TruffleContract(malaysia);
        // Connect provider to interact with contract
        App.contracts.Malaysia.setProvider(App.web3Provider);
  
        return App.render();
      });
    },
  
    render: function() {
      var malaysiaInstance;
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
  
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  
      // Load contract data - TODO
      App.contracts.Malaysia.deployed().then(function(instance) {
        malaysiaInstance = instance;
        return malaysiaInstance.owner.call();
      })
      .then(function() {
       // TODO
        loader.hide();
        content.show();
      })
      .catch(function(error) {
        console.warn(error);
      });

      $("#submitAddState").click(function(){
        var sA = $("#stateAdress")
        var sN = $("#stateName")
        var sK = $("#stateKingsName")
        
        App.contracts.Malaysia.deployed().then(function(instance) {
          malaysiaInstance = instance;
          return malaysiaInstance.addState(sA.val(), sN.val(), sK.val())
        })
        .then(function(tx_hash_that_i_promised_you){
          alert("Transaction sent. TxHash: " + tx_hash_that_i_promised_you.tx)
          
          // Resetting the form inputs
          sA.val("")
          sN.val("")
          sK.val("")
        })
      })

      $("#getStateSubmit").click(function(){
        console.log("Yo!");
        var sA = $("#getStateAdress")

        App.contracts.Malaysia.deployed().then(function(instance) {
          console.log("Am I get called?")
          malaysiaInstance = instance;
          return malaysiaInstance.states.call(sA.val())
        })
        .then(function(state_that_i_promised_you){
          console.log(state_that_i_promised_you)
        })
      })
    }
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  