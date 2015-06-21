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
        this.baseamount = ko.observable();
		this.baseprice = ko.observable();
		this.dateoffer  = ko.observable();
		this.storename = ko.observable();
		this.amountoffer = ko.observable();
		this.priceoffer = ko.observable();
		this.articledetails = ko.observable();
		this.comment = ko.observable();
		// phones: ko.observableArray(data.phones)
		
		//populate our model with the initial data
		this.update(data);
    }
	
	//can pass fresh data to this function at anytime to apply updates or revert to a prior version
	customer.prototype.update = function(data) { 
		this.articlename(data.articlename || "articlename");
		this.baseamount(data.baseamount || "baseamount");
		this.baseprice(data.baseprice || "baseprice");
		this.dateoffer(data.dateoffer || "dateoffer");
		this.storename(data.storename || "storename");
		this.amountoffer(data.amountoffer || "amountoffer");
		this.priceoffer(data.priceoffer || "priceoffer");
		this.articledetails(data.articledetails || "articledetails");
		this.comment(data.comment || "comment");

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
	
	var initialData = [
					{ id: "1", articlename: "Auberginen", articledetails: ", Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "14.05.12", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "2", articlename: "Zucchini", articledetails: ", Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "14.05.12", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "3", articlename: "Salatgurke", articledetails: ", Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "14.05.12", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "4", articlename: "Champignons", articledetails: ", Niederlande/Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "14.05.12", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "5", articlename: "Salatgurke", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "11.06.12", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "6", articlename: "Paprika", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "11.06.12", priceoffer: "3,99", amountoffer: "1", comment: "" },
{ id: "7", articlename: "Blumenkohl", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "11.06.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "8", articlename: "Zucchini", articledetails: "Mini, Südafrika", storename: "Edeka", baseamount: "kg", baseprice: "19,95", dateoffer: "11.06.12", priceoffer: "3,99", amountoffer: "0,2", comment: "" },
{ id: "9", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,58", dateoffer: "11.06.12", priceoffer: "1,29", amountoffer: "0,5", comment: "" },
{ id: "10", articlename: "Zucchini", articledetails: ", Baden", storename: "Norma", baseamount: "kg", baseprice: "1,29", dateoffer: "18.06.12", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "11", articlename: "Blumenkohl", articledetails: ", Baden", storename: "Norma", baseamount: "kg", baseprice: "Stück", dateoffer: "18.06.12", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "12", articlename: "Karotten", articledetails: "Bund, Baden", storename: "Norma", baseamount: "kg", baseprice: "Bund", dateoffer: "18.06.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "13", articlename: "Zucchini", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "18.06.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "14", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,38", dateoffer: "18.06.12", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "15", articlename: "Karotten", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "18.06.12", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "16", articlename: "Champignons", articledetails: ", Niederlande/Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,97", dateoffer: "18.06.12", priceoffer: "1,49", amountoffer: "0,3", comment: "" },
{ id: "17", articlename: "Karotten", articledetails: "Bio, Israel", storename: "Penny", baseamount: "kg", baseprice: "0,99", dateoffer: "25.06.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "18", articlename: "Kohlrabi", articledetails: ", ", storename: "Norma", baseamount: "kg", baseprice: "Stück", dateoffer: "25.06.12", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "19", articlename: "Zucchini", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "25.06.12", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "20", articlename: "Auberginen", articledetails: ", Holland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "25.06.12", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "21", articlename: "Paprika", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "25.06.12", priceoffer: "3,99", amountoffer: "1", comment: "" },
{ id: "22", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "02.07.12", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "23", articlename: "Blumenkohl", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "02.07.12", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "24", articlename: "Blumenkohl", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "02.07.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "25", articlename: "Lauch", articledetails: ", Bawü", storename: "Netto", baseamount: "kg", baseprice: "1,5", dateoffer: "02.07.12", priceoffer: "1,5", amountoffer: "1", comment: "" },
{ id: "26", articlename: "Kohlrabi", articledetails: ", Bawü", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "02.07.12", priceoffer: "0,29", amountoffer: "1", comment: "" },
{ id: "27", articlename: "Paprika", articledetails: "Bio, Niederlande", storename: "Netto", baseamount: "kg", baseprice: "5,55", dateoffer: "09.07.12", priceoffer: "2,22", amountoffer: "0,4", comment: "" },
{ id: "28", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,9", dateoffer: "09.07.12", priceoffer: "1,79", amountoffer: "2", comment: "" },
{ id: "29", articlename: "Salatgurke", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "09.07.12", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "30", articlename: "Salatgurke", articledetails: "Bio, Klasse II, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "16.07.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "31", articlename: "Kohlrabi", articledetails: ", Bawü", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "16.07.12", priceoffer: "0,29", amountoffer: "1", comment: "" },
{ id: "32", articlename: "Kartoffeln", articledetails: "Speisefrüh, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,72", dateoffer: "16.07.12", priceoffer: "1,79", amountoffer: "2,5", comment: "Angebot" },
{ id: "33", articlename: "Sellerie", articledetails: ", Bawü", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "16.07.12", priceoffer: "0,66", amountoffer: "1", comment: "" },
{ id: "34", articlename: "Kohlrabi", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "22.06.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "35", articlename: "Lauch", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "22.06.12", priceoffer: "1,15", amountoffer: "0,39", comment: "" },
{ id: "36", articlename: "Paprika", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "4,01", dateoffer: "22.06.12", priceoffer: "0,97", amountoffer: "0,24", comment: "" },
{ id: "37", articlename: "Champignons", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "6,98", dateoffer: "27.04.12", priceoffer: "2,54", amountoffer: "0,36", comment: "" },
{ id: "38", articlename: "Champignons", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "7,01", dateoffer: "20.04.12", priceoffer: "1,5", amountoffer: "0,21", comment: "" },
{ id: "39", articlename: "Zucchini", articledetails: "Bio, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,98", dateoffer: "23.07.12", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "40", articlename: "Karotten", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,88", dateoffer: "23.07.12", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "41", articlename: "Kartoffeln", articledetails: "Speisefrüh, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,8", dateoffer: "23.07.12", priceoffer: "1,59", amountoffer: "2", comment: "Angebot" },
{ id: "42", articlename: "Karotten", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "23.07.12", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "43", articlename: "Zucchini", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "17.07.12", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "44", articlename: "Karotten", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "30.07.12", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "45", articlename: "Champignons", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "30.07.12", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "46", articlename: "Karotten", articledetails: ", Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,69", dateoffer: "30.07.12", priceoffer: "0,69", amountoffer: "1", comment: "" },
{ id: "47", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,58", dateoffer: "30.07.12", priceoffer: "0,79", amountoffer: "0,5", comment: "Angebot" },
{ id: "48", articlename: "Karotten", articledetails: "Bio, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "30.07.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "49", articlename: "Zucchini", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,79", dateoffer: "13.08.12", priceoffer: "0,79", amountoffer: "1", comment: "Angebot" },
{ id: "50", articlename: "Salatgurke", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "13.08.12", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "51", articlename: "Zucchini", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "13.08.12", priceoffer: "0,99", amountoffer: "0,5", comment: "Angebot" },
{ id: "52", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "13.08.12", priceoffer: "0,79", amountoffer: "0,75", comment: "Angebot" },
{ id: "53", articlename: "Zucchini", articledetails: ", Württemberg", storename: "Norma", baseamount: "kg", baseprice: "1,09", dateoffer: "20.08.12", priceoffer: "1,09", amountoffer: "1", comment: "Angebot" },
{ id: "54", articlename: "Kohlrabi", articledetails: ", Württemberg", storename: "Norma", baseamount: "kg", baseprice: "Stück", dateoffer: "20.08.12", priceoffer: "0,39", amountoffer: "1", comment: "Angebot" },
{ id: "55", articlename: "Zucchini", articledetails: ", Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "0,77", dateoffer: "20.08.12", priceoffer: "0,77", amountoffer: "1", comment: "Angebot" },
{ id: "56", articlename: "Auberginen", articledetails: ", Niederlande", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "20.08.12", priceoffer: "0,44", amountoffer: "1", comment: "" },
{ id: "57", articlename: "Lauch", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "20.08.12", priceoffer: "1,29", amountoffer: "1", comment: "Angebot" },
{ id: "58", articlename: "Zucchini", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "03.09.12", priceoffer: "1,49", amountoffer: "0,5", comment: "Angebot" },
{ id: "59", articlename: "Champignons", articledetails: ", Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,98", dateoffer: "03.09.12", priceoffer: "1,19", amountoffer: "0,4", comment: "Angebot" },
{ id: "60", articlename: "Paprika", articledetails: "Bio, Niederlande", storename: "Netto", baseamount: "kg", baseprice: "4,98", dateoffer: "03.09.12", priceoffer: "1,99", amountoffer: "0,4", comment: "Angebot" },
{ id: "61", articlename: "Zucchini", articledetails: "Bio, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "2,22", dateoffer: "03.09.12", priceoffer: "1,11", amountoffer: "0,5", comment: "Angebot" },
{ id: "62", articlename: "Salatgurke", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "03.09.12", priceoffer: "0,59", amountoffer: "1", comment: "normal?" },
{ id: "63", articlename: "Knollensellerie", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "10.09.12", priceoffer: "1", amountoffer: "1,29", comment: "" },
{ id: "64", articlename: "Paprika", articledetails: ", Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "10.09.12", priceoffer: "0,99", amountoffer: "0,5", comment: "Angebot" },
{ id: "65", articlename: "Zucchini", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "10.09.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "66", articlename: "Blumenkohl", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "10.09.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "67", articlename: "Paprika", articledetails: ", Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "2,22", dateoffer: "10.09.12", priceoffer: "1,11", amountoffer: "0,5", comment: "Angebot" },
{ id: "68", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,58", dateoffer: "10.09.12", priceoffer: "0,79", amountoffer: "0,5", comment: "Angebot" },
{ id: "69", articlename: "Salatgurke", articledetails: ", Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "10.09.12", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "70", articlename: "Zucchini", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "17.09.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "71", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "17.09.12", priceoffer: "0,55", amountoffer: "1", comment: "" },
{ id: "72", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "17.09.12", priceoffer: "0,77", amountoffer: "1", comment: "" },
{ id: "73", articlename: "Kohlrabi", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "17.09.12", priceoffer: "0,29", amountoffer: "1", comment: "" },
{ id: "74", articlename: "Knollensellerie", articledetails: "mit Grün, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "17.09.12", priceoffer: "0,66", amountoffer: "1", comment: "" },
{ id: "75", articlename: "Pfifferlinge", articledetails: ", Russland, Bulgarien, Weißrussland", storename: "Edeka", baseamount: "kg", baseprice: "9,9", dateoffer: "17.09.12", priceoffer: "0,99", amountoffer: "0,1", comment: "Angebot" },
{ id: "76", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,9", dateoffer: "17.09.12", priceoffer: "1,79", amountoffer: "2", comment: "Angebot" },
{ id: "77", articlename: "Knollensellerie", articledetails: "mit Grün, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "17.09.12", priceoffer: "0,66", amountoffer: "1", comment: "3er Pack" },
{ id: "78", articlename: "Feldsalat", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "6,6", dateoffer: "24.09.12", priceoffer: "0,99", amountoffer: "0,15", comment: "Angebot" },
{ id: "79", articlename: "Kartoffeln", articledetails: "demeter, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,33", dateoffer: "24.09.12", priceoffer: "1,99", amountoffer: "1,5", comment: "Angebot" },
{ id: "80", articlename: "Kürbis", articledetails: "Hokkaido-Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "24.09.12", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "81", articlename: "Kürbis", articledetails: "Halloween, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "24.09.12", priceoffer: "2,79", amountoffer: "1", comment: "" },
{ id: "82", articlename: "Karotten", articledetails: "Bio, Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "0,77", dateoffer: "24.09.12", priceoffer: "0,77", amountoffer: "1", comment: "Angebot" },
{ id: "83", articlename: "Kartoffeln", articledetails: "Bio, Klasse 1, Deutschland/Österreich", storename: "Penny", baseamount: "kg", baseprice: "1,06", dateoffer: "24.09.12", priceoffer: "1,59", amountoffer: "1,5", comment: "Angebot" },
{ id: "84", articlename: "Kürbis", articledetails: "Hokkaido, Klasse 1, Württemberg", storename: "Norma", baseamount: "kg", baseprice: "Stück", dateoffer: "24.09.12", priceoffer: "1,19", amountoffer: "1", comment: "" },
{ id: "85", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "24.09.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "86", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "24.09.12", priceoffer: "1,11", amountoffer: "0,4", comment: "Angebot" },
{ id: "87", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,9", dateoffer: "01.10.12", priceoffer: "1,79", amountoffer: "2", comment: "" },
{ id: "88", articlename: "Knollensellerie", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "01.10.12", priceoffer: "0,66", amountoffer: "0,33", comment: "" },
{ id: "89", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,45", dateoffer: "01.01.12", priceoffer: "0,89", amountoffer: "2", comment: "Angebot" },
{ id: "90", articlename: "Karotten", articledetails: "Klasse II, Bio, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "01.10.12", priceoffer: "0,79", amountoffer: "1", comment: "Angebot" },
{ id: "91", articlename: "Paprika", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,58", dateoffer: "01.10.12", priceoffer: "0,79", amountoffer: "0,5", comment: "Angebot" },
{ id: "92", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "01.01.12", priceoffer: "0,99", amountoffer: "0,25", comment: "Angebot" },
{ id: "93", articlename: "Kürbis", articledetails: "Australischer, Deutschland", storename: "privat", baseamount: "kg", baseprice: "0,87", dateoffer: "01.10.12", priceoffer: "4", amountoffer: "4,6", comment: "" },
{ id: "94", articlename: "Kürbis", articledetails: "Hokkaido, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "01.10.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "95", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2", dateoffer: "13.10.12", priceoffer: "1", amountoffer: "0,5", comment: "Angebot" },
{ id: "96", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "08.10.12", priceoffer: "0,55", amountoffer: "1", comment: "Angebot" },
{ id: "97", articlename: "Zucchini", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,29", dateoffer: "08.10.12", priceoffer: "1,29", amountoffer: "1", comment: "Angebot" },
{ id: "98", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "08.10.12", priceoffer: "1,79", amountoffer: "0,3", comment: "Angebot" },
{ id: "99", articlename: "Stangensellerie", articledetails: "Klasse II, Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "08.10.12", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "100", articlename: "Karotten", articledetails: "Unsere Heimat, Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "08.10.12", priceoffer: "0,79", amountoffer: "0,75", comment: "Angebot" },
{ id: "101", articlename: "Kohlrabi", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "15.10.12", priceoffer: "0,29", amountoffer: "1", comment: "" },
{ id: "102", articlename: "Knollensellerie", articledetails: "demeter, Klasse II, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "15.10.12", priceoffer: "1", amountoffer: "0,99", comment: "" },
{ id: "103", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,75", dateoffer: "15.10.12", priceoffer: "1,49", amountoffer: "2", comment: "Angebot" },
{ id: "104", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "15.10.12", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "105", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,49", dateoffer: "15.10.12", priceoffer: "1,49", amountoffer: "1", comment: "Angebot" },
{ id: "106", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "2,78", dateoffer: "15.10.12", priceoffer: "1,11", amountoffer: "0,4", comment: "Angebot" },
{ id: "107", articlename: "Knollensellerie", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,77", dateoffer: "15.10.12", priceoffer: "0,77", amountoffer: "1", comment: "Angebot" },
{ id: "108", articlename: "Paprika", articledetails: "Klasse 2, Biobio, Niederlande", storename: "Netto", baseamount: "kg", baseprice: "4,98", dateoffer: "15.10.12", priceoffer: "1,99", amountoffer: "0,4", comment: "Angebot" },
{ id: "109", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "15.10.12", priceoffer: "0,79", amountoffer: "1", comment: "Angebot" },
{ id: "110", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,19", dateoffer: "22.10.12", priceoffer: "1,19", amountoffer: "1", comment: "Angebot" },
{ id: "111", articlename: "Zucchini", articledetails: "Klasse 2, Biobio, Italien", storename: "Netto", baseamount: "kg", baseprice: "2,98", dateoffer: "22.10.12", priceoffer: "1,49", amountoffer: "0,5", comment: "Angebot" },
{ id: "112", articlename: "Karotten", articledetails: "Klasse 2, Biobio, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,88", dateoffer: "22.10.12", priceoffer: "0,88", amountoffer: "1", comment: "Angebot" },
{ id: "113", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "22.10.12", priceoffer: "1,11", amountoffer: "0,4", comment: "Angebot" },
{ id: "114", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "22.10.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "115", articlename: "Broccoli", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "22.10.12", priceoffer: "0,99", amountoffer: "0,5", comment: "Angebot" },
{ id: "116", articlename: "Champignons", articledetails: "Klasse 1, braun, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "29.10.12", priceoffer: "0,99", amountoffer: "0,25", comment: "Angebot" },
{ id: "117", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "29.10.12", priceoffer: "1,29", amountoffer: "1", comment: "Angebot" },
{ id: "118", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,49", dateoffer: "29.10.12", priceoffer: "0,49", amountoffer: "1", comment: "Angebot" },
{ id: "119", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "29.10.12", priceoffer: "0,79", amountoffer: "0,5", comment: "Angebot" },
{ id: "120", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,38", dateoffer: "29.10.12", priceoffer: "0,69", amountoffer: "0,5", comment: "Angebot" },
{ id: "121", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "0,99", dateoffer: "05.11.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "122", articlename: "Salatgurke", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "05.11.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "123", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "05.11.12", priceoffer: "1,79", amountoffer: "0,3", comment: "Angebot" },
{ id: "124", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "05.11.12", priceoffer: "1,49", amountoffer: "1", comment: "Angebot" },
{ id: "125", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "05.11.12", priceoffer: "1,49", amountoffer: "1", comment: "Angebot" },
{ id: "126", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "05.11.12", priceoffer: "0,79", amountoffer: "0,75", comment: "Angebot" },
{ id: "127", articlename: "Kürbis", articledetails: "Hokkaido, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "05.11.12", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "128", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "05.11.12", priceoffer: "0,99", amountoffer: "1", comment: "Angebot" },
{ id: "129", articlename: "Paprika", articledetails: "Klasse II, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "05.11.12", priceoffer: "0,79", amountoffer: "0,5", comment: "Angebot" },
{ id: "130", articlename: "Rotkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "05.11.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "131", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,38", dateoffer: "05.11.12", priceoffer: "0,69", amountoffer: "0,5", comment: "Angebot" },
{ id: "132", articlename: "Kohlrabi", articledetails: ", Deutschland/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "05.11.12", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "133", articlename: "Karotten", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "1,8", dateoffer: "21.09.12", priceoffer: "0,54", amountoffer: "0,3", comment: "einzelne" },
{ id: "134", articlename: "Blumenkohl", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "04.10.12", priceoffer: "1,79", amountoffer: "1", comment: "" },
{ id: "135", articlename: "Paprika", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "12.10.12", priceoffer: "1,46", amountoffer: "0,37", comment: "" },
{ id: "136", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "4,48", dateoffer: "12.11.12", priceoffer: "1,79", amountoffer: "0,4", comment: "" },
{ id: "137", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,75", dateoffer: "12.11.12", priceoffer: "1,49", amountoffer: "2", comment: "" },
{ id: "138", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,77", dateoffer: "12.11.12", priceoffer: "0,77", amountoffer: "1", comment: "" },
{ id: "139", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,19", dateoffer: "12.11.12", priceoffer: "1,19", amountoffer: "1", comment: "" },
{ id: "140", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "12.11.12", priceoffer: "0,44", amountoffer: "1", comment: "" },
{ id: "141", articlename: "Rosenkohl", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "1,03", dateoffer: "12.11.12", priceoffer: "0,77", amountoffer: "0,75", comment: "" },
{ id: "142", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,77", dateoffer: "12.11.12", priceoffer: "0,77", amountoffer: "1", comment: "" },
{ id: "143", articlename: "Champignons", articledetails: "Bio, Klasse II, weiß, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "19.11.12", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "144", articlename: "Champignons", articledetails: "Klasse 1, braun, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "19.11.12", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "145", articlename: "Broccoli", articledetails: "Klasse 1, Spanien/Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,76", dateoffer: "19.11.12", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "146", articlename: "Knollensellerie", articledetails: "Klasse 2, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "19.11.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "147", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "19.11.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "148", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,98", dateoffer: "19.11.12", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "149", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,19", dateoffer: "16.11.12", priceoffer: "0,89", amountoffer: "0,75", comment: "Danke-Rabatt" },
{ id: "150", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "26.11.12", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "151", articlename: "Paprika", articledetails: "Klasse II, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "26.11.12", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "152", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "1,76", dateoffer: "26.11.12", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "153", articlename: "Stangensellerie", articledetails: "Klasse 1, Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "26.11.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "154", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "2,22", dateoffer: "26.11.12", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "155", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,38", dateoffer: "26.11.12", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "156", articlename: "Lauch", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "1", dateoffer: "26.11.12", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "157", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,99", dateoffer: "03.12.12", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "158", articlename: "Paprika", articledetails: "Klasse 2, Spanien/Israel", storename: "Netto", baseamount: "kg", baseprice: "4,23", dateoffer: "10.12.12", priceoffer: "1,69", amountoffer: "0,4", comment: "" },
{ id: "159", articlename: "Fenchel", articledetails: "Klasse 2, Italien", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "10.12.12", priceoffer: "1,39", amountoffer: "0,5", comment: "" },
{ id: "160", articlename: "Knollensellerie", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,66", dateoffer: "10.12.12", priceoffer: "0,66", amountoffer: "1", comment: "" },
{ id: "161", articlename: "Kohlrabi", articledetails: ", Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "10.12.12", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "162", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "10.12.12", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "163", articlename: "Lauch", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "10.12.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "164", articlename: "Kohlrabi", articledetails: "Klasse 1, Spanien/Italien", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "10.12.12", priceoffer: "0,44", amountoffer: "1", comment: "" },
{ id: "165", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,44", dateoffer: "10.12.12", priceoffer: "0,88", amountoffer: "2", comment: "" },
{ id: "166", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "10.12.12", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "167", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "10.12.12", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "168", articlename: "Pastinaken", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "10.12.12", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "169", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "10.12.12", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "170", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,8", dateoffer: "10.12.12", priceoffer: "1,59", amountoffer: "2", comment: "" },
{ id: "171", articlename: "Knollensellerie", articledetails: "Klasse 2, Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "10.12.12", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "172", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "10.12.12", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "173", articlename: "Blumenkohl", articledetails: "Klasse 1, Frankreich/Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "10.12.12", priceoffer: "1,11", amountoffer: "1", comment: "" },
{ id: "174", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "17.12.12", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "175", articlename: "Champignons", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "24.12.12", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "176", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "24.12.12", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "177", articlename: "Karotten", articledetails: "Klasse 2, Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "03.01.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "178", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,8", dateoffer: "03.01.13", priceoffer: "1,59", amountoffer: "2", comment: "" },
{ id: "179", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "07.01.13", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "180", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "07.01.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "181", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "07.01.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "182", articlename: "Knollensellerie", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "07.01.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "183", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "1,76", dateoffer: "14.01.13", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "184", articlename: "Champignons", articledetails: "Klasse 1, Niederlande", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "14.01.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "185", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "14.01.13", priceoffer: "0,44", amountoffer: "1", comment: "" },
{ id: "186", articlename: "Blumenkohl", articledetails: "Klasse 1, Frankreich/Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "14.01.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "187", articlename: "Kartoffeln", articledetails: "Raclette, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "14.01.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "188", articlename: "Champignons", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "6,98", dateoffer: "11.01.13", priceoffer: "1,2", amountoffer: "0,17", comment: "" },
{ id: "189", articlename: "Broccoli", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "20.01.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "190", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,79", dateoffer: "20.01.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "191", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "20.01.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "192", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Edeka", baseamount: "kg", baseprice: "3,96", dateoffer: "20.01.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "193", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "4,95", dateoffer: "21.01.13", priceoffer: "0,99", amountoffer: "0,2", comment: "" },
{ id: "194", articlename: "Kartoffeln", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,52", dateoffer: "21.01.13", priceoffer: "1,29", amountoffer: "2,5", comment: "" },
{ id: "195", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "21.01.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "196", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,5", dateoffer: "21.01.13", priceoffer: "0,99", amountoffer: "2", comment: "" },
{ id: "197", articlename: "Lauch", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "1,39", dateoffer: "21.01.13", priceoffer: "1,39", amountoffer: "1", comment: "" },
{ id: "198", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "21.01.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "199", articlename: "Kohlrabi", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "21.01.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "200", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,52", dateoffer: "21.01.13", priceoffer: "0,88", amountoffer: "0,25", comment: "" },
{ id: "201", articlename: "Champignons", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "6,98", dateoffer: "19.01.13", priceoffer: "1,41", amountoffer: "0,2", comment: "" },
{ id: "202", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,8", dateoffer: "28.01.13", priceoffer: "1,59", amountoffer: "2", comment: "" },
{ id: "203", articlename: "Champignons", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "28.01.13", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "204", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,99", dateoffer: "28.01.13", priceoffer: "2,99", amountoffer: "1", comment: "" },
{ id: "205", articlename: "Karotten", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "28.01.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "206", articlename: "Paprika", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "25.01.13", priceoffer: "3,99", amountoffer: "1", comment: "" },
{ id: "207", articlename: "Knollensellerie", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "04.02.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "208", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "04.02.13", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "209", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "04.02.13", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "210", articlename: "Broccoli", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "04.02.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "211", articlename: "Karotten", articledetails: "Klasse 1, Niederlande", storename: "Penny", baseamount: "kg", baseprice: "0,88", dateoffer: "04.02.13", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "212", articlename: "Kartoffeln", articledetails: "Klasse 1, Deutschland/Österreich", storename: "Penny", baseamount: "kg", baseprice: "0,99", dateoffer: "04.02.13", priceoffer: "1,49", amountoffer: "1,5", comment: "" },
{ id: "213", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Penny", baseamount: "kg", baseprice: "3,98", dateoffer: "04.02.13", priceoffer: "1,59", amountoffer: "0,4", comment: "" },
{ id: "214", articlename: "Pastinaken", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "3,52", dateoffer: "04.02.13", priceoffer: "0,88", amountoffer: "0,25", comment: "" },
{ id: "215", articlename: "Paprika", articledetails: "Klasse 2, Spanien/Israel", storename: "Netto", baseamount: "kg", baseprice: "4,48", dateoffer: "04.02.13", priceoffer: "1,79", amountoffer: "0,4", comment: "" },
{ id: "216", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland/Italien", storename: "Netto", baseamount: "kg", baseprice: "0,88", dateoffer: "04.02.13", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "217", articlename: "Kartoffeln", articledetails: "Mikrowelle, Frankreich", storename: "Netto", baseamount: "kg", baseprice: "1,98", dateoffer: "04.02.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "218", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "6,45", dateoffer: "04.02.13", priceoffer: "1,29", amountoffer: "0,2", comment: "" },
{ id: "219", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "04.02.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "220", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "11.02.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "221", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "11.02.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "222", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "1,38", dateoffer: "11.02.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "223", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "11.02.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "224", articlename: "Paprika", articledetails: "Klasse 2, Mix, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "11.02.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "225", articlename: "Paprika", articledetails: "Klasse 1, Minimix, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "5,55", dateoffer: "11.02.13", priceoffer: "1,11", amountoffer: "0,2", comment: "" },
{ id: "226", articlename: "Lauch", articledetails: "Klasse 1, Belgien", storename: "Penny", baseamount: "kg", baseprice: "1,49", dateoffer: "11.02.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "227", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,56", dateoffer: "11.02.13", priceoffer: "1,11", amountoffer: "2", comment: "" },
{ id: "228", articlename: "Paprika", articledetails: "Bio, Klasse 2, Spanien/Israel", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "18.02.13", priceoffer: "1,11", amountoffer: "0,4", comment: "" },
{ id: "229", articlename: "Lauch", articledetails: "Klasse 1, Deutschland/Belgien", storename: "Netto", baseamount: "kg", baseprice: "1,39", dateoffer: "18.02.13", priceoffer: "1,39", amountoffer: "1", comment: "" },
{ id: "230", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "18.02.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "231", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "18.02.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "232", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "18.02.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "233", articlename: "Paprika", articledetails: "Klasse 2, Spanien/Israel", storename: "Edeka", baseamount: "kg", baseprice: "4,98", dateoffer: "18.02.13", priceoffer: "1,99", amountoffer: "0,4", comment: "" },
{ id: "234", articlename: "Kartoffeln", articledetails: ", Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,37", dateoffer: "18.02.13", priceoffer: "1,49", amountoffer: "4", comment: "" },
{ id: "235", articlename: "Blumenkohl", articledetails: "Klasse 1, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "18.02.13", priceoffer: "1,11", amountoffer: "1", comment: "" },
{ id: "236", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "18.02.13", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "237", articlename: "Broccoli", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,38", dateoffer: "25.02.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "238", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "25.02.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "239", articlename: "Champignons", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "25.02.13", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "240", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Edeka", baseamount: "kg", baseprice: "3,96", dateoffer: "25.02.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "241", articlename: "Blumenkohl", articledetails: "Klasse 2, Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "25.02.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "242", articlename: "Kartoffeln", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,33", dateoffer: "25.02.13", priceoffer: "1,99", amountoffer: "1,5", comment: "" },
{ id: "243", articlename: "Karotten", articledetails: "Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,78", dateoffer: "25.02.13", priceoffer: "1", amountoffer: "1,29", comment: "" },
{ id: "244", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,52", dateoffer: "04.03.13", priceoffer: "0,88", amountoffer: "0,25", comment: "" },
{ id: "245", articlename: "Knollensellerie", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "04.03.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "246", articlename: "Lauch", articledetails: ", Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "1,59", dateoffer: "04.03.13", priceoffer: "1,59", amountoffer: "1", comment: "" },
{ id: "247", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "2,5", dateoffer: "04.03.13", priceoffer: "1,25", amountoffer: "0,5", comment: "" },
{ id: "248", articlename: "Lauch", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,25", dateoffer: "04.03.13", priceoffer: "1,25", amountoffer: "1", comment: "" },
{ id: "249", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,17", dateoffer: "04.03.13", priceoffer: "1,25", amountoffer: "0,3", comment: "" },
{ id: "250", articlename: "Kartoffeln", articledetails: "Klasse 1, Deutschland/Österreich", storename: "Penny", baseamount: "kg", baseprice: "0,99", dateoffer: "11.03.13", priceoffer: "1,49", amountoffer: "1,5", comment: "" },
{ id: "251", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "11.03.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "252", articlename: "Ananas", articledetails: "Baby, Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "11.03.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "253", articlename: "Zucchini", articledetails: "Klasse 1, Spanien/Marokko", storename: "Netto", baseamount: "kg", baseprice: "1,29", dateoffer: "11.03.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "254", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "11.03.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "255", articlename: "Ananas", articledetails: "Klasse 1, Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "11.03.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "256", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,9", dateoffer: "11.03.13", priceoffer: "1,79", amountoffer: "2", comment: "" },
{ id: "257", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica", storename: "Lidl", baseamount: "kg", baseprice: "Stück", dateoffer: "09.03.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "258", articlename: "Birne", articledetails: ", ", storename: "Lidl", baseamount: "kg", baseprice: "3", dateoffer: "09.03.13", priceoffer: "1,5", amountoffer: "0,5", comment: "" },
{ id: "259", articlename: "Paprika", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "18.03.13", priceoffer: "3,99", amountoffer: "1", comment: "" },
{ id: "260", articlename: "Kohlrabi", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "18.03.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "261", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,32", dateoffer: "18.03.13", priceoffer: "0,99", amountoffer: "0,75", comment: "" },
{ id: "262", articlename: "Broccoli", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,76", dateoffer: "18.03.13", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "263", articlename: "Salatgurke", articledetails: "Klasse 1, Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "18.03.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "264", articlename: "Salatgurke", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "18.03.13", priceoffer: "0,55", amountoffer: "1", comment: "" },
{ id: "265", articlename: "Knollensellerie", articledetails: ", ", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "18.03.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "266", articlename: "Zucchini", articledetails: "Klasse 2, Bio, Italien", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "18.03.13", priceoffer: "1,39", amountoffer: "0,5", comment: "" },
{ id: "267", articlename: "Karotten", articledetails: "Klasse 2, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "18.03.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "268", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,19", dateoffer: "18.03.13", priceoffer: "1,19", amountoffer: "1", comment: "" },
{ id: "269", articlename: "Paprika", articledetails: "Unsere Heimat, Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,25", dateoffer: "25.03.13", priceoffer: "1", amountoffer: "3,99", comment: "" },
{ id: "270", articlename: "Kartoffeln", articledetails: "Drillinge, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,67", dateoffer: "25.03.13", priceoffer: "1", amountoffer: "1,49", comment: "" },
{ id: "271", articlename: "Kartoffeln", articledetails: "Spargelkartoffeln, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "1,01", dateoffer: "25.03.13", priceoffer: "2", amountoffer: "1,99", comment: "" },
{ id: "272", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "25.03.13", priceoffer: "1", amountoffer: "0,99", comment: "" },
{ id: "273", articlename: "Karotten", articledetails: ", Italien", storename: "Netto", baseamount: "kg", baseprice: "Bund", dateoffer: "25.03.13", priceoffer: "1", amountoffer: "1,29", comment: "" },
{ id: "274", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "0,53", dateoffer: "25.03.13", priceoffer: "0,5", amountoffer: "0,95", comment: "" },
{ id: "275", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,56", dateoffer: "25.03.13", priceoffer: "1,11", amountoffer: "2", comment: "" },
{ id: "276", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,99", dateoffer: "25.03.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "277", articlename: "Paprika", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "2,98", dateoffer: "02.04.13", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "278", articlename: "Kohlrabi", articledetails: "Klasse 1, Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "02.04.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "279", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "02.04.13", priceoffer: "1,69", amountoffer: "1", comment: "" },
{ id: "280", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "02.04.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "281", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "02.04.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "282", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Honduras", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "02.04.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "283", articlename: "Zucchini", articledetails: "Klasse 1, Spanien/Marokko", storename: "Penny", baseamount: "kg", baseprice: "1,19", dateoffer: "02.04.13", priceoffer: "1,19", amountoffer: "1", comment: "" },
{ id: "284", articlename: "Kohlrabi", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "0,59", dateoffer: "10.04.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "285", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "08.04.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "286", articlename: "Lauch", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "2,99", dateoffer: "08.04.13", priceoffer: "2,99", amountoffer: "1", comment: "" },
{ id: "287", articlename: "Knollensellerie", articledetails: ", Deutschland/Niederlande", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "08.04.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "288", articlename: "Kartoffeln", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,5", dateoffer: "08.04.13", priceoffer: "1,99", amountoffer: "4", comment: "" },
{ id: "289", articlename: "Salatgurke", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "15.04.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "290", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "15.04.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "291", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "15.04.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "292", articlename: "Broccoli", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,38", dateoffer: "15.04.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "293", articlename: "Zucchini", articledetails: "Klasse 2, Bio, Italien", storename: "Netto", baseamount: "kg", baseprice: "2,78", dateoffer: "15.04.13", priceoffer: "1,39", amountoffer: "0,5", comment: "" },
{ id: "294", articlename: "Paprika", articledetails: "Klasse 2, Bio, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "6,98", dateoffer: "15.04.13", priceoffer: "2,79", amountoffer: "0,4", comment: "" },
{ id: "295", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "0,88", dateoffer: "15.04.13", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "296", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "1,1", dateoffer: "15.04.13", priceoffer: "0,55", amountoffer: "0,5", comment: "" },
{ id: "297", articlename: "Kartoffeln", articledetails: "Klasse 1, Ägypten/Tunesien", storename: "Penny", baseamount: "kg", baseprice: "0,86", dateoffer: "15.04.13", priceoffer: "1,29", amountoffer: "1,5", comment: "" },
{ id: "298", articlename: "Zucchini", articledetails: "Klasse 1, Spanien/Marokko", storename: "Penny", baseamount: "kg", baseprice: "0,99", dateoffer: "15.04.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "299", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,39", dateoffer: "15.04.13", priceoffer: "1,39", amountoffer: "1", comment: "" },
{ id: "300", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "15.04.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "301", articlename: "Paprika", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "3,99", dateoffer: "15.04.13", priceoffer: "3,99", amountoffer: "1", comment: "" },
{ id: "302", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "15.04.13", priceoffer: "3,33", amountoffer: "1", comment: "" },
{ id: "303", articlename: "Salatgurke", articledetails: "Klasse 2, Bio, Spanien/Bulgarien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "22.04.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "304", articlename: "Salatgurke", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "22.04.13", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "305", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "06.05.13", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "306", articlename: "Karotten", articledetails: "Klasse 1, Israel", storename: "Penny", baseamount: "kg", baseprice: "1,11", dateoffer: "06.05.13", priceoffer: "1,11", amountoffer: "1", comment: "" },
{ id: "307", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Honduras", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "06.05.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "308", articlename: "Kartoffeln", articledetails: "Spargelkartoffeln, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "1,25", dateoffer: "06.05.13", priceoffer: "2,49", amountoffer: "2", comment: "" },
{ id: "309", articlename: "Ananas", articledetails: "Baby, Klasse 1, Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "06.05.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "310", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,65", dateoffer: "03.05.13", priceoffer: "1,99", amountoffer: "0,75", comment: "" },
{ id: "311", articlename: "Paprika", articledetails: "Klasse 2, Bio, Spanien", storename: "Penny", baseamount: "kg", baseprice: "3,73", dateoffer: "13.05.13", priceoffer: "1,49", amountoffer: "0,4", comment: "" },
{ id: "312", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "13.05.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "313", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,52", dateoffer: "13.05.13", priceoffer: "0,88", amountoffer: "0,25", comment: "" },
{ id: "314", articlename: "Zucchini", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,49", dateoffer: "13.05.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "315", articlename: "Salatgurke", articledetails: "Klasse 1, Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "0,39", dateoffer: "13.05.13", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "316", articlename: "Paprika", articledetails: "Reichenau, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "13.05.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "317", articlename: "Ananas", articledetails: "Klasse 1, Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "20.05.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "318", articlename: "Kartoffeln", articledetails: "Spargelkartoffeln, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "1,25", dateoffer: "20.05.13", priceoffer: "2,49", amountoffer: "2", comment: "" },
{ id: "319", articlename: "Salatgurke", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "20.05.13", priceoffer: "1,11", amountoffer: "1", comment: "" },
{ id: "320", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "27.05.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "321", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,98", dateoffer: "27.05.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "322", articlename: "Salatgurke", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "27.05.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "323", articlename: "Paprika", articledetails: "Klasse 2, Niederlande", storename: "Netto", baseamount: "kg", baseprice: "2,22", dateoffer: "27.05.13", priceoffer: "2,22", amountoffer: "1", comment: "" },
{ id: "324", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1", dateoffer: "03.06.13", priceoffer: "1", amountoffer: "1", comment: "" },
{ id: "325", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "03.06.13", priceoffer: "3,33", amountoffer: "1", comment: "" },
{ id: "326", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "03.06.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "327", articlename: "Paprika", articledetails: "Klasse 2, Bio, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "6,73", dateoffer: "03.06.13", priceoffer: "2,69", amountoffer: "0,4", comment: "" },
{ id: "328", articlename: "Paprika", articledetails: "Unsere Heimat, ", storename: "Edeka", baseamount: "kg", baseprice: "5", dateoffer: "01.06.13", priceoffer: "2,27", amountoffer: "0,45", comment: "" },
{ id: "329", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,29", dateoffer: "10.06.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "330", articlename: "Kohlrabi", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "10.06.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "331", articlename: "Karotten", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,11", dateoffer: "10.06.13", priceoffer: "1,11", amountoffer: "1", comment: "" },
{ id: "332", articlename: "Salatgurke", articledetails: "Klasse 2, Bio, Bulgarien", storename: "Penny", baseamount: "kg", baseprice: "Stück", dateoffer: "17.06.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "333", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "17.06.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "334", articlename: "Paprika", articledetails: "Klasse 2, Bio, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "6,73", dateoffer: "17.06.13", priceoffer: "2,69", amountoffer: "0,4", comment: "" },
{ id: "335", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Edeka", baseamount: "kg", baseprice: "3,96", dateoffer: "17.06.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "336", articlename: "Kohlrabi", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "17.06.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "337", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,79", dateoffer: "17.06.13", priceoffer: "1,79", amountoffer: "1", comment: "" },
{ id: "338", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,79", dateoffer: "17.06.13", priceoffer: "1,79", amountoffer: "1", comment: "" },
{ id: "339", articlename: "Ananas", articledetails: "Klasse 1, Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "17.06.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "340", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "24.06.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "341", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "24.06.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "342", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,9", dateoffer: "24.06.13", priceoffer: "0,49", amountoffer: "0,1", comment: "" },
{ id: "343", articlename: "Salatgurke", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "24.06.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "344", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,5", dateoffer: "24.06.13", priceoffer: "2,99", amountoffer: "2", comment: "" },
{ id: "345", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "24.06.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "346", articlename: "Kohlrabi", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "24.06.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "347", articlename: "Zucchini", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "24.06.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "348", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "4,95", dateoffer: "01.07.13", priceoffer: "0,99", amountoffer: "0,2", comment: "" },
{ id: "349", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "3,96", dateoffer: "01.07.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "350", articlename: "Karotten", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,72", dateoffer: "01.07.13", priceoffer: "1,29", amountoffer: "0,75", comment: "" },
{ id: "351", articlename: "Kohlrabi", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "01.07.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "352", articlename: "Paprika", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "01.07.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "353", articlename: "Salatgurke", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "01.07.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "354", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "15.07.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "355", articlename: "Auberginen", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "15.07.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "356", articlename: "Zucchini", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "15.07.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "357", articlename: "Paprika", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "15.07.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "358", articlename: "Zucchini", articledetails: "Klasse 2, Bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "15.07.13", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "359", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,79", dateoffer: "22.07.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "360", articlename: "Zucchini", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,79", dateoffer: "22.07.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "361", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "22.07.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "362", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,78", dateoffer: "22.07.13", priceoffer: "0,89", amountoffer: "0,5", comment: "" },
{ id: "363", articlename: "Ananas", articledetails: "Baby, Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "22.07.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "364", articlename: "Blumenkohl", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "22.07.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "365", articlename: "Kohlrabi", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "22.07.13", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "366", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "22.07.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "367", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,17", dateoffer: "22.07.13", priceoffer: "0,88", amountoffer: "0,75", comment: "" },
{ id: "368", articlename: "Broccoli", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "29.07.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "369", articlename: "Champignons", articledetails: "Klasse 2, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "29.07.13", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "370", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "29.07.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "371", articlename: "Broccoli", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,76", dateoffer: "05.08.13", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "372", articlename: "Paprika", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "05.08.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "373", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "05.08.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "374", articlename: "Champignons", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "6,98", dateoffer: "10.08.13", priceoffer: "1,27", amountoffer: "0,18", comment: "" },
{ id: "375", articlename: "Zucchini", articledetails: ", ", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "10.08.13", priceoffer: "0,42", amountoffer: "0,28", comment: "" },
{ id: "376", articlename: "Paprika", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,58", dateoffer: "19.08.13", priceoffer: "0,79", amountoffer: "0,5", comment: "" },
{ id: "377", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "19.08.13", priceoffer: "0,55", amountoffer: "1", comment: "" },
{ id: "378", articlename: "Broccoli", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "19.08.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "379", articlename: "Karotten", articledetails: "Unsere Heimat, Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,79", dateoffer: "02.09.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "380", articlename: "Paprika", articledetails: "Unsere Heimat, Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "6,65", dateoffer: "02.09.13", priceoffer: "4,99", amountoffer: "0,75", comment: "" },
{ id: "381", articlename: "Knollensellerie", articledetails: "Unsere Heimat Bio, Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "02.09.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "382", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "02.09.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "383", articlename: "Knollensellerie", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "02.09.13", priceoffer: "0,69", amountoffer: "1", comment: "" },
{ id: "384", articlename: "Zucchini", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,89", dateoffer: "02.09.13", priceoffer: "0,89", amountoffer: "1", comment: "" },
{ id: "385", articlename: "Kürbis", articledetails: "Hokkaido, Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,39", dateoffer: "02.09.13", priceoffer: "1,39", amountoffer: "1", comment: "" },
{ id: "386", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "09.09.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "387", articlename: "Broccoli", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "09.09.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "388", articlename: "Paprika", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "09.09.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "389", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Polen", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "09.09.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "390", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Penny", baseamount: "kg", baseprice: "3,96", dateoffer: "16.09.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "391", articlename: "Lauch", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "16.09.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "392", articlename: "Sellerie", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,66", dateoffer: "16.09.13", priceoffer: "1,99", amountoffer: "3", comment: "Stück" },
{ id: "393", articlename: "Kartoffeln", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "16.09.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "394", articlename: "Paprika", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "16.09.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "395", articlename: "Broccoli", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "1,78", dateoffer: "16.09.13", priceoffer: "0,89", amountoffer: "0,5", comment: "" },
{ id: "396", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,59", dateoffer: "16.09.13", priceoffer: "0,59", amountoffer: "1", comment: "" },
{ id: "397", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "01.10.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "398", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "01.10.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "399", articlename: "Broccoli", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "2,98", dateoffer: "01.10.13", priceoffer: "1,49", amountoffer: "0,5", comment: "" },
{ id: "400", articlename: "Lauch", articledetails: "Klasse 1, Unsere Heimat, ", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "01.10.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "401", articlename: "Knollensellerie", articledetails: "Klasse 1, Unsere Heimat, ", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "01.10.13", priceoffer: "0,66", amountoffer: "3", comment: "" },
{ id: "402", articlename: "Paprika", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,76", dateoffer: "01.10.13", priceoffer: "0,88", amountoffer: "0,5", comment: "" },
{ id: "403", articlename: "Ananas", articledetails: ", Costa Rica/Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "01.10.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "404", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,78", dateoffer: "01.10.13", priceoffer: "0,89", amountoffer: "0,5", comment: "" },
{ id: "405", articlename: "Paprika", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "14.10.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "406", articlename: "Kartoffeln", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "14.10.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "407", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Penny", baseamount: "kg", baseprice: "1,29", dateoffer: "21.10.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "408", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "2,98", dateoffer: "21.10.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "409", articlename: "Broccoli", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,98", dateoffer: "21.10.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "410", articlename: "Wirsing", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "21.10.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "411", articlename: "Lauch", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "21.10.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "412", articlename: "Paprika", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "4,99", dateoffer: "28.10.13", priceoffer: "4,99", amountoffer: "1", comment: "" },
{ id: "413", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "28.10.13", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "414", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "28.10.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "415", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "04.11.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "416", articlename: "Kohlrabi", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "04.11.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "417", articlename: "Blumenkohl", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "04.11.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "418", articlename: "Zucchini", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,99", dateoffer: "04.11.13", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "419", articlename: "Auberginen", articledetails: "Klasse 1, Niederlande/Spanien", storename: "Netto", baseamount: "kg", baseprice: "0,49", dateoffer: "04.11.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "420", articlename: "Kohlrabi", articledetails: ", Deutschland/Italien", storename: "Netto", baseamount: "kg", baseprice: "0,39", dateoffer: "04.11.13", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "421", articlename: "Karotten", articledetails: "Klasse 1, Dänemark", storename: "Netto", baseamount: "kg", baseprice: "3,52", dateoffer: "04.11.13", priceoffer: "0,88", amountoffer: "0,25", comment: "" },
{ id: "422", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,49", dateoffer: "04.11.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "423", articlename: "Broccoli", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,38", dateoffer: "11.11.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "424", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "11.11.13", priceoffer: "0,39", amountoffer: "1", comment: "" },
{ id: "425", articlename: "Salatgurke", articledetails: "Klasse 2, Bio, Spanien/Bulgarien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "11.11.13", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "426", articlename: "Paprika", articledetails: "Klasse 2, Bio, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "4,98", dateoffer: "11.11.13", priceoffer: "1,99", amountoffer: "0,4", comment: "" },
{ id: "427", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "18.11.13", priceoffer: "0,79", amountoffer: "0,5", comment: "" },
{ id: "428", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,34", dateoffer: "18.11.13", priceoffer: "0,67", amountoffer: "0,5", comment: "" },
{ id: "429", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "1,38", dateoffer: "18.11.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "430", articlename: "Broccoli", articledetails: ", Spanien/Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "18.11.13", priceoffer: "0,79", amountoffer: "0,5", comment: "" },
{ id: "431", articlename: "Lauch", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "18.11.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "432", articlename: "Wirsing", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "18.11.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "433", articlename: "Broccoli", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,38", dateoffer: "25.11.13", priceoffer: "0,69", amountoffer: "0,5", comment: "" },
{ id: "434", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "25.11.13", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "435", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "25.11.13", priceoffer: "0,79", amountoffer: "0,5", comment: "" },
{ id: "436", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Edeka", baseamount: "kg", baseprice: "2,78", dateoffer: "25.11.13", priceoffer: "1,11", amountoffer: "0,4", comment: "" },
{ id: "437", articlename: "Blumenkohl", articledetails: "Klasse 1, Frankreich/Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "25.11.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "438", articlename: "Knollensellerie", articledetails: "Klasse 2, Unsere Heimat Bio Demeter, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "25.11.13", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "439", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "3,96", dateoffer: "25.11.13", priceoffer: "0,99", amountoffer: "0,25", comment: "" },
{ id: "440", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "25.11.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "441", articlename: "Karotten", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "25.11.13", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "442", articlename: "Kohlrabi", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "25.11.13", priceoffer: "0,49", amountoffer: "1", comment: "" },
{ id: "443", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "25.11.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "444", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "5,97", dateoffer: "09.12.13", priceoffer: "1,79", amountoffer: "0,3", comment: "" },
{ id: "445", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "16.12.13", priceoffer: "0,77", amountoffer: "1", comment: "" },
{ id: "446", articlename: "Kartoffeln", articledetails: ", Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,8", dateoffer: "16.12.13", priceoffer: "1,99", amountoffer: "2,5", comment: "" },
{ id: "447", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,99", dateoffer: "16.12.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "448", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "16.12.13", priceoffer: "1,59", amountoffer: "1", comment: "" },
{ id: "449", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,98", dateoffer: "16.12.13", priceoffer: "1,19", amountoffer: "0,4", comment: "" },
{ id: "450", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "16.12.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "451", articlename: "Kartoffeln", articledetails: "Klasse 1, Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "16.12.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "452", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "23.12.13", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "453", articlename: "Knollensellerie", articledetails: "Klasse 2, Bio, demeter, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "23.12.13", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "454", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,05", dateoffer: "23.12.13", priceoffer: "0,79", amountoffer: "0,75", comment: "" },
{ id: "455", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "23.12.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "456", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Ghana", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "30.12.13", priceoffer: "1,19", amountoffer: "1", comment: "" },
{ id: "457", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,98", dateoffer: "30.12.13", priceoffer: "0,99", amountoffer: "0,5", comment: "" },
{ id: "458", articlename: "Paprika", articledetails: "Klasse 2, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,22", dateoffer: "30.12.13", priceoffer: "1,11", amountoffer: "0,5", comment: "" },
{ id: "459", articlename: "Champignons", articledetails: "Klasse 2, Niederlande/Polen", storename: "Edeka", baseamount: "kg", baseprice: "7,45", dateoffer: "30.12.13", priceoffer: "1,49", amountoffer: "0,2", comment: "" },
{ id: "460", articlename: "Kartoffeln", articledetails: "Ackergold, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "30.12.13", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "461", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "2,48", dateoffer: "07.01.14", priceoffer: "0,99", amountoffer: "0,4", comment: "" },
{ id: "462", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "1,78", dateoffer: "07.01.14", priceoffer: "0,89", amountoffer: "0,5", comment: "" },
{ id: "463", articlename: "Knollensellerie", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "07.01.14", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "464", articlename: "Wirsing", articledetails: "Klasse 1, Deutschland", storename: "Netto", baseamount: "kg", baseprice: "0,79", dateoffer: "07.01.14", priceoffer: "0,79", amountoffer: "1", comment: "" },
{ id: "465", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "2,99", dateoffer: "13.01.14", priceoffer: "2,99", amountoffer: "1", comment: "" },
{ id: "466", articlename: "Ananas", articledetails: "Klasse 1, Costa Rica/Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "13.01.14", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "467", articlename: "Blumenkohl", articledetails: "Klasse 1, Frankreich", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "13.01.14", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "468", articlename: "Kartoffeln", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1", dateoffer: "13.01.14", priceoffer: "1,99", amountoffer: "2", comment: "" },
{ id: "469", articlename: "Wirsing", articledetails: "Unsere Heimat, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "0,99", dateoffer: "13.01.14", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "470", articlename: "Champignons", articledetails: "Klasse 1, Deutschland", storename: "Rewe", baseamount: "kg", baseprice: "4,97", dateoffer: "13.01.14", priceoffer: "1,49", amountoffer: "0,3", comment: "" },
{ id: "471", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Rewe", baseamount: "kg", baseprice: "0,69", dateoffer: "13.01.14", priceoffer: "0,69", amountoffer: "1", comment: "" },
{ id: "472", articlename: "Kartoffeln", articledetails: "Klasse 1, Deutschland", storename: "Rewe", baseamount: "kg", baseprice: "1,59", dateoffer: "13.01.14", priceoffer: "1,59", amountoffer: "1", comment: "" },
{ id: "473", articlename: "Knollensellerie", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "20.01.14", priceoffer: "0,99", amountoffer: "1", comment: "" },
{ id: "474", articlename: "Fenchel", articledetails: "Klasse 1, Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,99", dateoffer: "20.01.14", priceoffer: "1,99", amountoffer: "1", comment: "" },
{ id: "475", articlename: "Lauch", articledetails: "Klasse 1, Unsere Heimat, bio, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,29", dateoffer: "20.01.14", priceoffer: "1,29", amountoffer: "1", comment: "" },
{ id: "476", articlename: "Pastinaken", articledetails: "Klasse 1, ", storename: "Edeka", baseamount: "kg", baseprice: "3,98", dateoffer: "20.01.14", priceoffer: "1,99", amountoffer: "0,5", comment: "" },
{ id: "477", articlename: "Champignons", articledetails: "Klasse 1, Niederlande/Polen", storename: "Netto", baseamount: "kg", baseprice: "4,36", dateoffer: "20.01.14", priceoffer: "1,09", amountoffer: "0,25", comment: "" },
{ id: "478", articlename: "Stangensellerie", articledetails: "Klasse 1, Spanien/Italien", storename: "Netto", baseamount: "kg", baseprice: "Stück", dateoffer: "20.01.14", priceoffer: "0,88", amountoffer: "1", comment: "" },
{ id: "479", articlename: "Champignons", articledetails: "Klasse 1, Deutschland/Niederlande", storename: "Edeka", baseamount: "kg", baseprice: "2,48", dateoffer: "20.01.14", priceoffer: "0,99", amountoffer: "0,4", comment: "" },
{ id: "480", articlename: "Karotten", articledetails: "Klasse 1, Deutschland", storename: "Penny", baseamount: "kg", baseprice: "0,6", dateoffer: "20.01.14", priceoffer: "1,19", amountoffer: "2", comment: "" },
{ id: "481", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Penny", baseamount: "kg", baseprice: "2,38", dateoffer: "20.01.14", priceoffer: "1,19", amountoffer: "0,5", comment: "" },
{ id: "482", articlename: "Salatgurke", articledetails: "Klasse 1, Spanien", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "27.01.14", priceoffer: "0,69", amountoffer: "1", comment: "" },
{ id: "483", articlename: "Broccoli", articledetails: "Klasse 1, Spanien/Italien", storename: "Edeka", baseamount: "kg", baseprice: "1,58", dateoffer: "27.01.14", priceoffer: "0,79", amountoffer: "0,5", comment: "" },
{ id: "484", articlename: "Knollensellerie", articledetails: "Klasse 1, Deutschland", storename: "Edeka", baseamount: "kg", baseprice: "1,49", dateoffer: "27.01.14", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "485", articlename: "Ananas", articledetails: "Klasse 1, Ghana", storename: "Edeka", baseamount: "kg", baseprice: "Stück", dateoffer: "27.01.14", priceoffer: "1,49", amountoffer: "1", comment: "" },
{ id: "486", articlename: "Paprika", articledetails: "Klasse 1, Spanien", storename: "Netto", baseamount: "kg", baseprice: "2,22", dateoffer: "27.01.14", priceoffer: "1,11", amountoffer: "0,5", comment: "" }

				
				
				
				
				];
	// var initialData = [
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
