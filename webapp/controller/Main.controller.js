sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment"
], function(BaseController, Formatter, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment) {
	"use strict";

	return BaseController.extend("com.improva.zimpsaosipapp.controller.Main", {
		formatter: Formatter,
		
		_formFragments: {},
		
		onInit: function() {
			// this.getView().setModel(this._createViewModel(), "Main");
			// this.getView().setModel(this._createBayiSipModel(),"Bayisip");

			// Set the initial form to be the display one
			// this._showFormFragment("FormEdit");

		},
		onPressSiparisYaratma: function(){
		},
		_showFormFragment: function(sFragmentName) {
			
			// var oPage = this.byId("sub1");

			// debugger;
			// oPage.setElementBindingContext(this._getFormFragment(sFragmentName));
		},
		_getFormFragment: function(sFragmentName) {
			// var oFormFragment = this._formFragments[sFragmentName];
			var oView = this.getView();
			// create popover lazily (singleton)
			if (!this._oFragment) {
				this._oFragment = Fragment.load({
					id: oView.getId(),
					name: "com.improva.ZIMPSAOSIP_APP.fragment.FormEdit",
					controller: this
				}).then(function(oFragment) {
					oView.addDependent(oFragment);
					return oFragment;
				});
			}
			return this._oFragment;
			// this._formFragments[sFragmentName];
		}
	});

});