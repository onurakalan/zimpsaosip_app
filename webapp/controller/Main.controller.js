sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"../model/datamodel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
], function(BaseController, Formatter, DataModel, JSONModel, Filter, FilterOperator,Sorter, 
			GroupHeaderListItem, Device, Fragment,MessageBox,MessageToast) {
	"use strict";

	return BaseController.extend("com.improva.zimpsaosipapp.controller.Main", {
		formatter: Formatter,
		datamodel: DataModel,
		_formFragments: {},

		
		onInit: function() {
			//set the initial JSON Model
			this.getView().setModel(new JSONModel(this.datamodel.mainView),"mainView");
			this.getView().setModel(new JSONModel(this.datamodel.Header),"header");
			this.getView().setModel(new JSONModel(this.datamodel.HeaderText),"headerText");

			this.setJSONModel([],"orderItems");

			// Set the initial fragments
			this._showFormFragment("sub1","FormEdit");
			this._showFormFragment("sub2","OrderItemTab");
			
		},
		onAfterRendering:function(){
		},
		onExit:function(){
		},
		onChangeAuart:function(oEvent){
			var oSource = oEvent.getSource();
			
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Auart","");
				this.getView().getModel("headerText").setProperty("/AuartDesc", "");
				oSource.setSelectedKey("");
				return;
			};
			this.getView().getModel("header").setProperty("/Auart", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/AuartDesc", oSource.getSelectedItem().getText());

		},
		onClearAuart:function(oEvent){
			this.getView().getModel("header").setProperty("/Auart","");
			this.getView().getModel("headerText").setProperty("/AuartDesc", "");
			this.byId("selAuart").setSelectedKey("");
		},
		onChangeVkorg:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeVkorg, oSource);
			}else{
				this._changeVkorg(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearVkorg:function(){
			var oSource = this.byId("selVkorg");

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearVkorg, oSource);
			}else{
				this._clearVkorg(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeVkorg: function(oSource, pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkorg"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Vkorg","");
				this.getView().getModel("headerText").setProperty("/VkorgDesc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Vkorg", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/VkorgDesc", oSource.getSelectedItem().getText());
			
			this._setCustomerList();
			this._updateListMaterial();
			this._updateListRefdoc();
		},
		_clearVkorg:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkorg"));
				return;
			}
			this.getView().getModel("header").setProperty("/Vkorg","");
			this.getView().getModel("headerText").setProperty("/VkorgDesc", "");
			oSource.setSelectedKey("");

			this._setCustomerList();
			this._updateListMaterial();
			this._updateListRefdoc();

		},
		onChangeVtweg:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeVtweg, oSource);
			}else{
				this._changeVtweg(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearVtweg:function(oEvent){
			var oSource = this.byId("selVtweg");

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearVtweg, oSource);
			}else{
				debugger;
				this._clearVtweg(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeVtweg:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vtweg"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Vtweg","");
				this.getView().getModel("headerText").setProperty("/VtwegDesc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Vtweg", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/VtwegDesc", oSource.getSelectedItem().getText());
			
			this._setCustomerList();
			this._updateListMaterial();
			this._updateListRefdoc();
			
		},
		_clearVtweg:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vtweg"));
				return;
			}		
			this.getView().getModel("header").setProperty("/Vtweg","");
			this.getView().getModel("headerText").setProperty("/VtwegDesc", "");
			oSource.setSelectedKey("");

			this._setCustomerList();
			this._updateListMaterial();
			this._updateListRefdoc();
		},
		_updateListMaterial:function(){
			var oItems = this.getView().getModel("orderItems");
			var aItems = oItems.getData().results;
			if (aItems.length === 0 ){
				return;
			}

			this._configFilterMaterial()
			var aFilter = [];
			var oFilter = {filter: this.aFilterMatnr };
			var oFilterCopy = JSON.parse(JSON.stringify(oFilter));
			
			for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
				oFilterCopy.filter.push( new Filter("Matnr",FilterOperator.EQ,aItems[itmIndx].Material));
			}

			this.getView().getModel().read("/ShMalzemeSet", {
				filters: oFilterCopy.filter,
				success: function(oData) {
					for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
						if( oData.results.findIndex(o => o.Matnr === aItems[itmIndx].Material ) === -1 ){
							aItems[itmIndx].Material = "";
							aItems[itmIndx].MaterialDesc = "";
							aItems[itmIndx].Meins = "";
						}
					}
					oItems.refresh();
				}.bind(this)
			});
		},
		_updateListRefdoc:function(){
			var oItems = this.getView().getModel("orderItems");
			var aItems = oItems.getData().results;
			if (aItems.length === 0 ){
				return;
			}

			this._configFilterRefdoc()
			var aFilter = [];
			var oFilter = {filter: this.aFilterRefdoc };
			var oFilterCopy = JSON.parse(JSON.stringify(oFilter));
			
			for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
				oFilterCopy.filter.push( new Filter("Vbeln",FilterOperator.EQ,aItems[itmIndx].RefDocNo));
			}

			this.getView().getModel().read("/RefTeklifSet", {
				filters: oFilterCopy.filter,
				success: function(oData) {
					for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
						if( oData.results.findIndex(o => o.Vbeln === aItems[itmIndx].RefDocNo && 
														 o.Posnr === aItems[itmIndx].RefDocItm ) === -1 ){
							aItems[itmIndx].RefDocNo = "";
							aItems[itmIndx].RefDocItm = "";
						}
					}
					oItems.refresh();
				}.bind(this)
			});
		},
		onChangeSpart:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeSpart, oSource);
			}else{
				this._changeSpart(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearSpart:function () {
			var oSource = this.byId("selSpart");

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearSpart, oSource);
			}else{
				this._clearSpart(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeSpart:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Spart"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Spart","");
				this.getView().getModel("headerText").setProperty("/SpartDesc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Spart", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/SpartDesc", oSource.getSelectedItem().getText());
			
			this._setCustomerList();
			this._updateListRefdoc();
		},
		_clearSpart:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Spart"));
				return;
			}	
			this.getView().getModel("header").setProperty("/Spart","");
			this.getView().getModel("headerText").setProperty("/SpartDesc", "");
			oSource.setSelectedKey("");

			this._setCustomerList();
			this._updateListRefdoc();
		},
		onChangeVkbur:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeVkbur, oSource);
			}else{
				this._changeVkbur(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearVkbur:function(){
			var oSource = this.byId("selVkbur");

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearVkbur, oSource);
			}else{
				this._clearVkbur(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeVkbur:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkbur"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Vkbur","");
				this.getView().getModel("headerText").setProperty("/VkburDesc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Vkbur", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/VkburDesc", oSource.getSelectedItem().getText());
			
			this._setCustomerList();
			this._updateListRefdoc();
		},
		_clearVkbur:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkbur"));
				return;
			}
			this.getView().getModel("header").setProperty("/Vkbur","");
			this.getView().getModel("headerText").setProperty("/VkburDesc", "");
			oSource.setSelectedKey("");

			this._setCustomerList();
			this._updateListRefdoc();
		},
		onChangeVkgrp:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeVkgrp, oSource);
			}else{
				this._changeVkgrp(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearVkgrp:function(){
			var oSource = this.byId("selVkgrp");
			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearVkgrp, oSource);
			}else{
				this._clearVkgrp(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeVkgrp:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkgrp"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Vkgrp","");
				this.getView().getModel("headerText").setProperty("/VkgrpDesc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Vkgrp", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/VkgrpDesc", oSource.getSelectedItem().getText());
			
			this._setCustomerList();
			this._updateListRefdoc();
		},
		_clearVkgrp:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Vkgrp"));
				return;
			}
			this.getView().getModel("header").setProperty("/Vkgrp","");
			this.getView().getModel("headerText").setProperty("/VkgrpDesc", "");
			oSource.setSelectedKey("");

			this._setCustomerList();
			this._updateListRefdoc();
		},
		onChangeKunnr:function(oEvent){
			var oSource = oEvent.getSource();

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._changeKunnr, oSource);
			}else{
				this._changeKunnr(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		onClearKunnr:function(){
			var oSource = this.byId("selKunnr");

			var aData = this.getView().getModel("orderItems").getData().results;
			if (aData.length != 0 ){
				this.showConfirmationDialog("sureQs", this._clearKunnr, oSource);
			}else{
				this._clearKunnr(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_changeKunnr:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Kunnr"));
				return;
			}		
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Kunnr","");
				this.getView().getModel("headerText").setProperty("/CustomerName", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Kunnr", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/CustomerName", oSource.getSelectedItem().getText());
			
			this._updateListRefdoc();
		},
		_clearKunnr:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelectedKey(this.getView().getModel("header").getProperty("/Kunnr"));
				return;
			}	
			this.getView().getModel("header").setProperty("/Kunnr","");
			this.getView().getModel("headerText").setProperty("/CustomerName", "");
			oSource.setSelectedKey("");
			
			this._updateListRefdoc();
		},
		onSelectCustRef:function(oEvent){
			debugger;
			var oData = this.getView().getModel("orderItems").getData();
			var oSource = oEvent.getSource();
			
			if (oSource.getSelected()){
				this.getView().getModel("mainView").setProperty("/bCustomerRef", oSource.getSelected());
				return;
			}

			if ( oData.results.findIndex(o => o.RefDocNo !== ''  ) >= 0 ){
				this.showConfirmationDialog("sureQs", this._clearCustRef, oSource);
			}else{
				this._clearCustRef(oSource,sap.m.MessageBox.Action.YES);
			}
		},
		_clearCustRef:function(oSource,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				oSource.setSelected(this.getView().getModel("mainView").getProperty("/bCustomerRef"));
				return;
			}

			this.getView().getModel("mainView").setProperty("/bCustomerRef", oSource.getSelected());
			
			var oItem = this.getView().getModel("orderItems");
			var oData = oItem.getData();

			for (let index = 0; index < oData.results.length; index++) {
				oData.results[index].RefDocNo = "";
				oData.results[index].RefDocItm = "";
			}
			oItem.refresh();
			
		},
		onChangeOrder: function(oEvent){
			var oSource = oEvent.getSource();
			this.getView().getModel("header").setProperty("/Orderno", oSource.getValue());
		},
		onChangeZterm:function(oEvent){
			var oSource = oEvent.getSource();
			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Zterm","");
				this.getView().getModel("headerText").setProperty("/ZtermDesc", "");
				oSource.setSelectedKey("");
				return;
			};
			this.getView().getModel("header").setProperty("/Zterm", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/ZtermDesc", oSource.getSelectedItem().getText());
		},
		onClearZterm:function(){
			this.getView().getModel("header").setProperty("/Zterm","");
			this.getView().getModel("headerText").setProperty("/ZtermDesc", "");
			this.byId("selZterm").setSelectedKey("");
		},
		onChangeInco1:function(oEvent){
			var oSource = oEvent.getSource();

			if ( !this.formatter.isValidSelection(oSource) ){
				this.getView().getModel("header").setProperty("/Inco1","");
				this.getView().getModel("headerText").setProperty("/Inco1Desc", "");
				oSource.setSelectedKey("");
				return;
			};

			this.getView().getModel("header").setProperty("/Inco1", oSource.getSelectedKey());
			this.getView().getModel("headerText").setProperty("/Inco1Desc", oSource.getSelectedItem().getText());
		},
		onClearInco1:function(){
			this.getView().getModel("header").setProperty("/Inco1","");
			this.getView().getModel("headerText").setProperty("/Inco1Desc", "");
			this.byId("selInco1").setSelectedKey("");
		},
		onChangeInco2:function(oEvent){
			var oSource = oEvent.getSource();
			this.getView().getModel("header").setProperty("/Inco2", oSource.getValue());
		},
		handleSavePress:function(oEvent){
			// check datamodels
			
			// models to temp

			//display mode
			this._toggleButtonsAndView(false);
		},
		handleEditPress:function(oEvent){

			//edit mode
			this._toggleButtonsAndView(true);
		},
		handleCancelPress:function(oEvent){
			//back the changes temp to model

			//display mode
			this._toggleButtonsAndView(false);
		},
		_setCustomerList:function(){
			var aFilter = [];

			this.getView().getModel("header").setProperty("/Kunnr","");
			this.getView().getModel("headerText").setProperty("/CustomerName", "");
			this.byId("selKunnr").setSelectedKey("");

			var oHeader = this.getView().getModel("header");

			if (oHeader.getProperty("/Vtweg")){
				aFilter.push(new Filter("Vtweg",FilterOperator.EQ,oHeader.getProperty("/Vtweg")));
			}
			if (oHeader.getProperty("/Spart")){
				aFilter.push(new Filter("Spart",FilterOperator.EQ,oHeader.getProperty("/Spart")));
			}
			if (oHeader.getProperty("/Vkorg")){
				aFilter.push(new Filter("Vkorg",FilterOperator.EQ,oHeader.getProperty("/Vkorg")));
			}
			if (oHeader.getProperty("/Vkbur")){
				aFilter.push(new Filter("Vkbur",FilterOperator.EQ,oHeader.getProperty("/Vkbur")));
			}
			if (oHeader.getProperty("/Vkgrp")){
				aFilter.push(new Filter("Vkgrp",FilterOperator.EQ,oHeader.getProperty("/Vkgrp")));
			}
			this._setSelectList("selKunnr",aFilter);
		},
		_setSelectList: function (sObjectId, aFilter) {
			var oSel = this.getView().byId(sObjectId);
			oSel.getBinding("items").filter(aFilter, "Application");
		},
		_toggleButtonsAndView : function (bEdit) {

			// // Show the appropriate action buttons
			this.getView().getModel("mainView").setProperty("/bEdit", bEdit);

			// Set the right form type
			this._showFormFragment("sub1", bEdit ? "FormEdit" : "FormDisplay");

		},
		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}
			oFormFragment =  sap.ui.xmlfragment(this.getView().getId(), "com.improva.zimpsaosipapp.fragment." + sFragmentName,this);
			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},
		_showFormFragment : function (sObjectId,sFragmentName) {
			var oPage = this.byId(sObjectId);

			oPage.removeAllBlocks();
			oPage.insertBlock(this._getFormFragment(sFragmentName));
		},

		handleAddItem: function(oEvent){
			var aItems = this.getView().getModel("orderItems").getData().results;
			var oItmLine = JSON.parse(JSON.stringify(this.datamodel.Item));
			this.datamodel.Item.Posnr = this.datamodel.Item.Posnr + 1;
			oItmLine.Posnr = this.datamodel.Item.Posnr * 10;
			aItems.push(oItmLine);
			this.getView().getModel("orderItems").refresh();
		},
		handleRemoveItem: function(oEvent){
			// remove selected Item
			var oTable = this.getView().byId("idOrderItemTab");
			var oModel = this.getView().getModel("orderItems");
			var oTableData = oModel.getData();            
			var aContexts = oTable.getSelectedContextPaths().sort();
			debugger;
			for (let i=aContexts.length -1; i>=0; i--) {
				let index = parseInt(aContexts[i].split("/results/")[1]);
				oTableData.results.splice(index, 1);
				this.datamodel.Item.Posnr = this.datamodel.Item.Posnr - 1;
			}
			//update Item Number
			for (let index = 0; index < oTableData.results.length; index++) {
				oTableData.results[index].Posnr = ( index + 1 ) * 10;
			}

			oModel.refresh(); 
			oTable.removeSelections(true);
		},
		handleValueHelp: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			this._sPath = oEvent.getSource().getBindingContext("orderItems").getPath();
			this._oObject = oEvent.getSource().getBindingContext("orderItems").getObject();

			if (!this._oValueHelpDialog) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.ShMaterial",
					controller: this
				}).then(function(oValueHelpDialog){
					this._oValueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialog);
					this._configValueHelpDialogMatnr();
					this._oValueHelpDialog.open();
				}.bind(this));
			} else {
				this._configValueHelpDialogMatnr();
				this._oValueHelpDialog.open();
			}
		},
		_configValueHelpDialogMatnr: function() {		
			
			this._configFilterMaterial();

			this._oValueHelpDialog.getBinding("items").filter(this.aFilterMatnr);
		},
		_configFilterMaterial:function(){
			this.aFilterMatnr = [];

			var sVtweg = this.getView().getModel("header").getProperty("/Vtweg");
			var sVkorg = this.getView().getModel("header").getProperty("/Vkorg");
			if ( sVtweg ){
				this.aFilterMatnr.push(new Filter("Vtweg",FilterOperator.EQ,sVtweg));
			}
			if (sVkorg){
				this.aFilterMatnr.push(new Filter("Vkorg",FilterOperator.EQ,sVkorg));
			}
		},

		handleValueHelpClose : function (oEvent) {
			var oModel = this.getView().getModel("orderItems");

			var oSelectedItem = oEvent.getParameter("selectedItem");
			
			if (oSelectedItem){
				var sMaterial = oSelectedItem.getTitle();
				var sMaterialDesc = oSelectedItem.getDescription();
				var sUnit = oSelectedItem.getInfo();
			}

			oModel.setProperty(this._sPath + "/Material", sMaterial);
			oModel.setProperty(this._sPath + "/MaterialDesc", sMaterialDesc);
			oModel.setProperty(this._sPath + "/Meins", sUnit);
			oModel.refresh();

			this._checkInitial(this.byId(this.inputId,"errorMaterial"));
		},
		handleSearch: function(oEvent) {
			var aFilter = [];
			var oFilter = {filter: this.aFilterMatnr };
			var oFilterCopy = JSON.parse(JSON.stringify(oFilter));

			var sValue = oEvent.getParameter("value");
			if (sValue){
				oFilterCopy.filter.push( new	Filter("Matnr", FilterOperator.Contains, sValue) );
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilterCopy.filter);
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleValueHelpRefdoc: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			this._sPath = oEvent.getSource().getBindingContext("orderItems").getPath();
			this._oObject = oEvent.getSource().getBindingContext("orderItems").getObject();

			if (!this._oValueHelpDialogRefdoc) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.ShRefdoc",
					controller: this
				}).then(function(oValueHelpDialog){
					this._oValueHelpDialogRefdoc = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialogRefdoc);
					this._configValueHelpDialogRefdoc();
					this._oValueHelpDialogRefdoc.open();
				}.bind(this));
			} else {
				this._configValueHelpDialogRefdoc();
				this._oValueHelpDialogRefdoc.open();
			}
		},
		_configValueHelpDialogRefdoc: function() {		
			
			this._configFilterRefdoc();

			this._oValueHelpDialogRefdoc.getBinding("items").filter(this.aFilterRefdoc);
		},
		_configFilterRefdoc:function(){
			this.aFilterRefdoc = [];

			var sVtweg = this.getView().getModel("header").getProperty("/Vtweg");
			var sVkorg = this.getView().getModel("header").getProperty("/Vkorg");
			var sSpart = this.getView().getModel("header").getProperty("/Spart");
			var sVkbur = this.getView().getModel("header").getProperty("/Vkbur");
			var sVkgrp = this.getView().getModel("header").getProperty("/Vkgrp");
			var sKunnr = this.getView().getModel("header").getProperty("/Kunnr");
			
			if ( sVtweg ){
				this.aFilterRefdoc.push(new Filter("Vtweg",FilterOperator.EQ,sVtweg));
			}
			if (sVkorg){
				this.aFilterRefdoc.push(new Filter("Vkorg",FilterOperator.EQ,sVkorg));
			}
			if (sSpart){
				this.aFilterRefdoc.push(new Filter("Spart",FilterOperator.EQ,sSpart));
			}
			if (sVkbur){
				this.aFilterRefdoc.push(new Filter("Vkbur",FilterOperator.EQ,sVkbur));
			}
			if (sVkgrp){
				this.aFilterRefdoc.push(new Filter("Vkgrp",FilterOperator.EQ,sVkgrp));
			}
			if (sKunnr){
				this.aFilterRefdoc.push(new Filter("Kunnr",FilterOperator.EQ,sKunnr));
			}
		},

		handleValueHelpCloseRefdoc : function (oEvent) {
			var oModel = this.getView().getModel("orderItems");

			var oSelectedItem = oEvent.getParameter("selectedItem");
			
			if (oSelectedItem){
				var sRefdocNo = oSelectedItem.getTitle();
				var sRefdocItm = oSelectedItem.getDescription();
			}
			oModel.setProperty(this._sPath + "/RefDocNo", sRefdocNo);
			oModel.setProperty(this._sPath + "/RefDocItm", sRefdocItm);
			oModel.refresh();

			this._checkInitial(this.byId(this.inputId,"checkRefdoc"));
		},
		handleSearchRefdoc: function(oEvent) {
			var aFilter = [];
			var oFilter = {filter: this.aFilterRefdoc };
			var oFilterCopy = JSON.parse(JSON.stringify(oFilter));

			var sValue = oEvent.getParameter("value");
			if (sValue){
				oFilterCopy.filter.push( new Filter("Vbeln", FilterOperator.Contains, sValue) );
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilterCopy.filter);
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleValueHelpCurrency: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			this._sPath = oEvent.getSource().getBindingContext("orderItems").getPath();
			this._oObject = oEvent.getSource().getBindingContext("orderItems").getObject();

			if (!this._oValueHelpDialogCurrency) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.ShCurrency",
					controller: this
				}).then(function(oValueHelpDialog){
					this._oValueHelpDialogCurrency = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialogCurrency);
					this._configValueHelpDialogCurrency();
					this._oValueHelpDialogCurrency.open();
				}.bind(this));
			} else {
				this._configValueHelpDialogCurrency();
				this._oValueHelpDialogCurrency.open();
			}
		},
		_configValueHelpDialogCurrency: function() {		
			var aFilter = [];
			
			aFilter.push(new Filter("Waers",FilterOperator.EQ,"TRY"));
			aFilter.push(new Filter("Waers",FilterOperator.EQ,"EUR"));
			aFilter.push(new Filter("Waers",FilterOperator.EQ,"USD"));
			aFilter.push(new Filter("Waers",FilterOperator.EQ,"GBP"));

			this._oValueHelpDialogCurrency.getBinding("items").filter(aFilter);
		},

		handleValueHelpCloseCurrency : function (oEvent) {
			var oModel = this.getView().getModel("orderItems");

			var oSelectedItem = oEvent.getParameter("selectedItem");
			
			if (oSelectedItem){
				var sCurrency = oSelectedItem.getTitle();
			}
			oModel.setProperty(this._sPath + "/Currency", sCurrency);
			oModel.refresh();

			this._checkInitial(this.byId(this.inputId,"checkCurrency"));
		},
		handleSearchCurrency: function(oEvent) {
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleUpdateItem:function(oEvent){

		},
		onPressSchedule:function(oEvent){
			// simülasyon datası varsa açılır.

			this._oObject = this.getView().getModel("orderItems").getObject(oEvent.getParameters("items").listItem.getBindingContextPath());

			if (!this._oObject.Simulation ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("notExeUsability"));
				return;
			}

			if (this._oObject.Usability.length === 0){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("notFoundUsability"));
				return;
			}

			if (!this._oValueHelpDialogSchedule) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.ScheduleList",
					controller: this
				}).then(function(oValueHelpDialog){
					this._oValueHelpDialogSchedule = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialogSchedule);
					this._configValueHelpDialogSchedule();
					this._oValueHelpDialogSchedule.open();
				}.bind(this));
			} else {
				this._configValueHelpDialogSchedule();
				this._oValueHelpDialogSchedule.open();
			}
		},
		_configValueHelpDialogSchedule:function(){
			// simülasyon datasını filtrele
			this.setJSONModel(this._oObject.Usability,"scheduleList");
		},
		simulateOrder:function(oEvent){
			debugger;
			//tablodan seçili satırları al
			var aSelectedItems = this._getSelectedItems(this.byId("idOrderItemTab").getSelectedItems());

			if ( aSelectedItems.length === 0 ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("selectItems"));
				return;
			}

			var oHeader = this.getView().getModel("header").getData();
			var bObligatoryCheck = this._checkObligatorFields(oHeader,aSelectedItems);

			if ( !bObligatoryCheck ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("chckObligatory"));
				$(".sapMMessageToast").addClass("messageInfo");
				return;
			}
			
			
			// kaydetme modeli ile maple

			// sümüle flagını x yap


			// hepsini tek seferde back-ende gönder

			// geri gelen usabilit datasını modeldeki uygun yere yaz.

			// gelen datanın ilk satırındaki termin vemşktar bizimkini bozuyorsa tekrar simüle tiki atma,
			// miktarı sil, tarihi sil vs.

			//not: simüle edildikten sonra bir şey değiştirilirse tekrar simüle etmeyi gerekli yap

		},
		_getSelectedItems: function(aSelectedList) {
			var aList = [];
			for (let selIndx = 0; selIndx < aSelectedList.length; selIndx++) {
				aList.push(this.getView().getModel("orderItems").getObject(aSelectedList[selIndx].getBindingContextPath()));
			}
			return aList;
		},
		_checkObligatorFields:function(oHeader,aList){
			var bObliCheck = true;
			
			if( this._checkInitial(this.byId("selAuart","emptyAuart"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selVtweg","emptyVtweg"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selVkorg","emptyVkorg"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selSpart","emptySpart"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selVkbur","emptyVkbur"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selVkgrp","emptyVkgrp"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selKunnr","emptyKunnr"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("inpOrder","emptyOrder"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selZterm","emptyZterm"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("selInco1","emptyInco1"))){
				bObliCheck = false;
			}
			if( this._checkInitial(this.byId("inpInco2","emptyInco2"))){
				bObliCheck = false;
			}

			var bCusRef = this.getView().getModel("mainView").getProperty("bCustomerRef");

			for (let indx = 0; indx < aList.length; indx++) {
				if ( !aList[indx].Material ||
				     !aList[indx].TerminTarihi ||
					 !aList[indx].Miktar ||
					 (bCusRef && !aList[indx].RefDocNo )  ){
						bObliCheck = false;
						break;
					 } 
			}
			return bObliCheck;
		},
		createOrder:function(oEvent){
			// tüm kalemler başarılı bir şekilde simüle edilmişse ve gerekli alanlar dolu ise çalışsın.
			sap.ui.core.BusyIndicator.show();



			var aTransfer = this.getModel("Transfer").getProperty("/results");
			var oTarget   = this.getModel("transferView");
			
			var oEntry = {
				"Kunnr": oTarget.getProperty("/Kunnr"),
				"Lenum": oTarget.getProperty("/trgtLnm"),	
				"Lgpla": oTarget.getProperty("/Lgpla"),
				"Transfer": aTransfer 
			};
			
			var mPrm = {
				success: function(oData,oResponse) {
					sap.ui.core.BusyIndicator.hide();
					
					var sCompleteMessage = oResponse.headers["sap-message"];
					if (sCompleteMessage) {
						this.onClearScreen();
						var oMessage = JSON.parse(sCompleteMessage);
						this.showSuccessMessage("", oMessage.message);

					}
				}.bind(this),
				error: function() {
					sap.ui.core.BusyIndicator.hide();
				}
			};
			
			this.getView().getModel().create("/TargetSet", oEntry, mPrm );

		},
		_checkInitial:function(oSource,pErrTx){
			var sValue = oSource.getValue();
			if (sValue) {
				oSource.setValueState("None");
				return false;
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(this.getView().getModel("i18n").getResourceBundle().getText(pErrTx));
				return true;
			}
		}
	});

});