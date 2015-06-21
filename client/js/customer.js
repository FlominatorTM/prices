// ----------------------------------------------------
// Customer Demo with Knockout
// Michael Schelb
// 10.05.2013
// ----------------------------------------------------
// links:
// 10 things to know about knockout.js: http://www.knockmeout.net/2011/06/10-things-to-know-about-knockoutjs-on.html
// A simple editor: http://www.knockmeout.net/2013/01/simple-editor-pattern-knockout-js.html
// live samples: http://www.knockmeout.net/2011/08/all-of-knockoutjscom-live-samples-in.html


$(window).load(function () {

    function customer(data) {
        // var this = this;
        this.articlename = ko.observable();
		this.articledetails = ko.observable();
		this.records = ko.observableArray(data.records)
		// this.baseamount = ko.observable();
		// this.baseprice = ko.observable();
		// this.dateoffer  = ko.observable();
		// this.storename = ko.observable();
		// this.amountoffer = ko.observable();
		// this.priceoffer = ko.observable();
		// this.comment = ko.observable();
		// phones: ko.observableArray(data.phones)
		
		//populate our model with the initial data
		this.update(data);
    }
	
	//can pass fresh data to this function at anytime to apply updates or revert to a prior version
	customer.prototype.update = function(data) { 
		 this.articlename(data.articlename || "");
		// this.baseamount(data.baseamount || "baseamount");
		// this.baseprice(data.baseprice || "baseprice");
		// this.dateoffer(data.dateoffer || "dateoffer");
		// this.storename(data.storename || "storename");
		// this.amountoffer(data.amountoffer || "amountoffer");
		// this.priceoffer(data.priceoffer || "priceoffer");
		this.articledetails(data.articledetails || "");
		// this.comment(data.comment || "comment");

	};
	
    function viewModel(items) {
		var self = this;
		var newItem = false;
	
		//turn the raw items into Item objects
		this.items = ko.observableArray(ko.utils.arrayMap(items, function(data) {
			return new customer(data);
		}));
		
        //visible or disable the current view
        this.listVisible = ko.observable(true);
        this.editVisible = ko.observable(false);
		
		//hold the currently selected item
		this.selectedItem = ko.observable();
		
		//make edits to a copy
		this.itemForEditing = ko.observable();
     
		// ----------------------------------
		// public function: item edit
		// ----------------------------------
		this.selectItem = this.selectItem.bind(this);
		this.editItem = this.editItem.bind(this);
		this.listItems = this.listItems.bind(this);
		this.acceptItem = this.acceptItem.bind(this);
		this.revertItem = this.revertItem.bind(this);
		
		// ----------------------------------
		// public function: list handling
		// ----------------------------------
        self.removeItem = function () {
            self.items.remove(this);
        };
		
        self.removeSelectedItem = function (item) {
            self.listVisible(true);
            self.editVisible(false);
            console.log("remove before " + ko.toJSON(this));
            self.items.remove(item);
            self.selectedItem(null);
            console.log("remove after " + ko.toJSON(this));
        };

        self.addItem = function () {
			self.newItem = true;
            self.items.push(new customer({ articlename: "", baseamount: "" }));
			self.selectedItem(self.items()[self.items().length-1]);
			self.editItem(self.selectedItem);
            // console.log("add after" + ko.toJSON(this));
        };     
	}
	
	ko.utils.extend(viewModel.prototype, {
		// select an item and make a copy of it for editing
		selectItem: function(item) {
		
			console.log("selectItem " + ko.toJSON(this));
			
			this.listVisible(false);
            this.editVisible(false);
			this.selectedItem(item);
			// this.itemForEditing(new Item(ko.toJS(item)));
		},
		
		editItem: function(item) {
		
		    console.log("editItem " + ko.toJSON(this));
			
			this.listVisible(false);
            this.editVisible(true);
			// this.selectedItem(item);
			this.itemForEditing(new customer(ko.toJS(item)));
		},
		
		listItems: function (item) {
			this.listVisible(true);
            this.editVisible(false);
			this.selectedItem(null);
        },
		
		acceptItem: function(item) {
		
			console.log("acceptItem 1 " + ko.toJSON(this));
		
			var selected = this.selectedItem(),
				edited = ko.toJS(this.itemForEditing()); //clean copy of edited
			
			// apply updates from the edited item to the selected item
			selected.update(edited);
			
			console.log("acceptItem 2 " + ko.toJSON(this));

			// clear selected item
			this.selectedItem(null);
			this.itemForEditing(null);
			
			this.listVisible(true);
            this.editVisible(false);			
			this.newItem = false;
			
			console.log("acceptItem 3 " + ko.toJSON(this));
		},
		
		// just throw away the edited item and clear the selected observables
		revertItem: function() {
			if(this.newItem == true)
			{
				this.removeSelectedItem(this.items()[this.items().length-1]);
				this.newItem = false;
				console.log("remove item");
			}
			else
			{
				this.listVisible(true);
				this.editVisible(false);				
			}
			this.selectedItem(null);
			this.itemForEditing(null);
		}
	});
	
	//	// var initialData = [
			// { id: "1", articlename: "Max", baseamount: "Müstermann", street: "Musterstrasse 1", city: "Musterstadt", price: "1.99",
				// phones: [
				// { type: "Office", number: "01125/45454" },
				// { type: "Home", number: "+49 5689642 546564" },
				// { type: "Mobile", number: "017515454654"}],
				// note: "Das ist eine Notiz. Unser Kunde benötigt dringend einen neuen Brenner! Aber Achtung, er will nur wenig zahlen! Das ist eine Notiz. Unser Kunde benötigt dringend einen neuen Brenner! Aber Achtung, er will nur wenig zahlen!"
			// },
			// { id: "2", articlename: "Paula", baseamount: "Musterfrau", street: "Reeperbahn 12", city: "Hamburg",
				// phones: [
				// { type: "Office", number: "" },
				// { type: "Home", number: "05324/5565743" },
				// { type: "Mobile", number: ""}],
				// note: ""
			// },
			// { id: "3", articlename: "Heinz", baseamount: "Wagner", street: "", city: "Hannover",
				// phones: [
				// { type: "Office", number: "076555555" },
				// { type: "Home", number: "" },
				// { type: "Mobile", number: ""}],
				// note: "Das ist eine Notiz. Unser Kunde benötigt dringend einen neuen Brenner! Aber Achtung, er will nur wenig zahlen!"
			// },
			// { id: "4", articlename: "Hannes", baseamount: "Meier", street: "Seestr. 12", city: "",
				// phones: [
				// { type: "Office", number: "" },
				// { type: "Home", number: "" },
				// { type: "Mobile", number: ""}],
				// note: ""
			// },
			// { id: "5", articlename: "Andrea", baseamount: "Lindenberg", street: "Alster 15", city: "Hamburg",
				// phones: [
				// { type: "Office", number: "+49 (4525) 4245245" },
				// { type: "Home", number: "" },
				// { type: "Mobile", number: ""}],
				// note: "Das ist eine Notiz!"
			// },
		// ];
	
	// ko.applyBindings(new viewModel([
		// { articlename: "Hans", baseamount: "Meier" },
		// { articlename: "Max", baseamount: "Mustermann" },
		// { articlename: "Paula", baseamount: "Tanne" }
		// ]));
		
	ko.applyBindings(new viewModel(initialData));
		
});
