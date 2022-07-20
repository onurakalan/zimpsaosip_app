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

			let bDesktop = this.getOwnerComponent().getModel("device").getData().system.desktop;
			debugger;

			this._showFormFragment("sub2",bDesktop ? "OrderItemTabEdit" : "OrderItemTabDisp" );
			
		},
		onAfterRendering:function(){
		},
		onExit:function(){
		},
		onChangeAuart:function(oEvent){
			var oSource = oEvent.getSource();
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

			var aFilter = this._configFilterMaterial()
			
			for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
				aFilter.push( new Filter("Matnr",FilterOperator.EQ,aItems[itmIndx].Material));
			}

			this.getView().getModel().read("/ShMalzemeSet", {
				filters: aFilter,
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

			var aFilterRedoc = this._configFilterRefdoc()
			
			for (let itmIndx = 0; itmIndx < aItems.length; itmIndx++) {
				aFilterRedoc.push( new Filter("Vbeln",FilterOperator.EQ,aItems[itmIndx].RefDocNo));
			}

			this.getView().getModel().read("/RefTeklifSet", {
				filters: aFilterRedoc,
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
			this._showFormFragment("sub2", bEdit ? "OrderItemTabEdit" : "OrderItemTabDisp");

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
		handleAddItemPopover: function(){
			if (!this._oAddDialog) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.AddItem",
					controller: this
				}).then(function(oAddDialog){
					this._oAddDialog = oAddDialog;
					this.getView().addDependent(this._oAddDialog);
					this._configAddDialog();
					this._oAddDialog.open();
				}.bind(this));
			} else {
				this._configAddDialog();
				this._oAddDialog.open();
			}
		},
		handleAddItemConfirm:function(){
			this.datamodel.Item.Posnr = this.datamodel.Item.Posnr + 1;
			var oItmLine = this.getView().getModel("itemView").getData();
			oItmLine.Posnr = this.datamodel.Item.Posnr * 10;
			
			var aItems = this.getView().getModel("orderItems").getData().results;
			aItems.push(oItmLine);
			this.getView().getModel("orderItems").refresh();
			
			this._oAddDialog.close();
		},
		handleAddItemCancel:function(){
			this._oAddDialog.close();
		},
		_configAddDialog:function(){
			var oItem = JSON.parse(JSON.stringify(this.datamodel.Item));
			this.getView().setModel(new JSONModel(oItem),"itemView");
		},
		handleRemoveItem: function(oEvent){
			// remove selected Item
			var oTable = this.getView().byId("idOrderItemTab");
			var oModel = this.getView().getModel("orderItems");
			var oTableData = oModel.getData();            
			var aContexts = oTable.getSelectedContextPaths().sort();
			
			for (let i=aContexts.length -1; i>=0; i--) {
				let index = parseInt(aContexts[i].split("/results/")[1]);
				oTableData.results.splice(index, 1);
			}

			//update Item Number
			for (let index = 0; index < oTableData.results.length; index++) {
				oTableData.results[index].Posnr = ( index + 1 ) * 10;
			}
			if (oTableData.results.length == 0){
				this.datamodel.Item.Posnr = 0;
			}else{
				this.datamodel.Item.Posnr = oTableData.results[oTableData.results.length - 1].Posnr / 10;
			}
			oModel.refresh(); 
			oTable.removeSelections(true);
		},
		handleValueHelp: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (oEvent.getSource().getBindingContext("orderItems")){
				this._sPath = oEvent.getSource().getBindingContext("orderItems").getPath();
				this._oObject = oEvent.getSource().getBindingContext("orderItems").getObject();
			}else{
				this._sPath = "";
				this._oObject="";
			}

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
			
			var aFilterMatnr = this._configFilterMaterial();

			this._oValueHelpDialog.getBinding("items").filter(aFilterMatnr);
		},
		_configFilterMaterial:function(){
			var aFilterMatnr = [];

			var sVtweg = this.getView().getModel("header").getProperty("/Vtweg");
			var sVkorg = this.getView().getModel("header").getProperty("/Vkorg");
			if ( sVtweg ){
				aFilterMatnr.push(new Filter("Vtweg",FilterOperator.EQ,sVtweg));
			}
			if (sVkorg){
				aFilterMatnr.push(new Filter("Vkorg",FilterOperator.EQ,sVkorg));
			}
			return aFilterMatnr;
		},

		handleValueHelpClose : function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem){
				var sMaterial = oSelectedItem.getTitle();
				var sMaterialDesc = oSelectedItem.getDescription();
				var sUnit = oSelectedItem.getInfo();
			}
			
			if (this._sPath){
				var oModel = this.getView().getModel("orderItems");
				oModel.setProperty(this._sPath + "/Material", sMaterial);
				oModel.setProperty(this._sPath + "/MaterialDesc", sMaterialDesc);
				oModel.setProperty(this._sPath + "/Meins", sUnit);
				oModel.refresh();
			}else{
				var oModel = this.getView().getModel("itemView");
				oModel.setProperty("/Material", sMaterial);
				oModel.setProperty("/MaterialDesc", sMaterialDesc);
				oModel.setProperty("/Meins", sUnit);
			}

			this._checkInitial(this.byId(this.inputId,"errorMaterial"));
		},
		handleSearch: function(oEvent) {
			var aFilterMatnr = this._configFilterMaterial();

			var sValue = oEvent.getParameter("value");
			if (sValue){
				aFilterMatnr.push( new Filter("Matnr", FilterOperator.Contains, sValue) );
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(aFilterMatnr);
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleValueHelpRefdoc: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			var oPath = oEvent.getSource().getBindingContext("orderItems");
			if (oPath){
				this._sPath = oPath.getPath();
				this._oObject = oPath.getObject();
			}else{
				this._sPath = "";
				this._oObject="";
			}

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
			
			var aFilterRefdoc = this._configFilterRefdoc();

			this._oValueHelpDialogRefdoc.getBinding("items").filter(aFilterRefdoc);
		},
		_configFilterRefdoc:function(){
			var aFilterRefdoc = [];

			var sVtweg = this.getView().getModel("header").getProperty("/Vtweg");
			var sVkorg = this.getView().getModel("header").getProperty("/Vkorg");
			var sSpart = this.getView().getModel("header").getProperty("/Spart");
			var sVkbur = this.getView().getModel("header").getProperty("/Vkbur");
			var sVkgrp = this.getView().getModel("header").getProperty("/Vkgrp");
			var sKunnr = this.getView().getModel("header").getProperty("/Kunnr");
			
			if ( sVtweg ){
				aFilterRefdoc.push(new Filter("Vtweg",FilterOperator.EQ,sVtweg));
			}
			if (sVkorg){
				aFilterRefdoc.push(new Filter("Vkorg",FilterOperator.EQ,sVkorg));
			}
			if (sSpart){
				aFilterRefdoc.push(new Filter("Spart",FilterOperator.EQ,sSpart));
			}
			if (sVkbur){
				aFilterRefdoc.push(new Filter("Vkbur",FilterOperator.EQ,sVkbur));
			}
			if (sVkgrp){
				aFilterRefdoc.push(new Filter("Vkgrp",FilterOperator.EQ,sVkgrp));
			}
			if (sKunnr){
				aFilterRefdoc.push(new Filter("Kunnr",FilterOperator.EQ,sKunnr));
			}
			return aFilterRefdoc;
		},

		handleValueHelpCloseRefdoc : function (oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem){
				var sRefdocNo = oSelectedItem.getTitle();
				var sRefdocItm = oSelectedItem.getDescription();
			}
			
			if ( this._sPath ){
				var oModel = this.getView().getModel("orderItems");
				oModel.setProperty(this._sPath + "/RefDocNo", sRefdocNo);
				oModel.setProperty(this._sPath + "/RefDocItm", sRefdocItm);
				oModel.refresh();
			}else{
				var oModel = this.getView().getModel("itemView");
				oModel.setProperty("/RefDocNo", sRefdocNo);
				oModel.setProperty("/RefDocItm", sRefdocItm);
				oModel.refresh();
			}

			this._checkInitial(this.byId(this.inputId,"checkRefdoc"));
		},
		handleSearchRefdoc: function(oEvent) {
			var aFilterRefdoc = this._configFilterRefdoc();

			var sValue = oEvent.getParameter("value");
			if (sValue){
				aFilterRefdoc.push( new Filter("Vbeln", FilterOperator.Contains, sValue) );
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(aFilterRefdoc);
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleValueHelpCurrency: function(oEvent) {
			this.inputId = oEvent.getSource().getId();
			var oPath = oEvent.getSource().getBindingContext("orderItems");
			if(oPath){
				this._sPath = oPath.getPath();
				this._oObject = oPath.getObject();
			}else{
				this._sPath = "";
				this._oObject="";
			}
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

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem){
				var sCurrency = oSelectedItem.getTitle();
			}
			if ( this._sPath){
				var oModel = this.getView().getModel("orderItems");
				oModel.setProperty(this._sPath + "/Currency", sCurrency);
				oModel.refresh();
			}else{
				var oModel = this.getView().getModel("itemView");
				oModel.setProperty("/Currency", sCurrency);
				oModel.refresh();
			}

			this._checkInitial(this.byId(this.inputId,"checkCurrency"));
		},
		handleSearchCurrency: function(oEvent) {
		},
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		// // // // // // // // // // // // // // // // // // // // // // // // // // // // a
		handleUpdateItem:function(oEvent){

		},
		onPressUsability:function(oEvent){
			// simülasyon datası varsa açılır.

			this._oObject = this.getView().getModel("orderItems").getObject(oEvent.getParameters("items").listItem.getBindingContextPath());

			if (this._oObject.Usability.length === 0){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("notFoundUsability"));
				return;
			}

			if (!this._oValueHelpDialogUsability) {
				Fragment.load({
					name: "com.improva.zimpsaosipapp.fragment.UsabilityList",
					controller: this
				}).then(function(oValueHelpDialog){
					this._oValueHelpDialogUsability = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialogUsability);
					this._configValueHelpDialogUsability();
					this._oValueHelpDialogUsability.open();
				}.bind(this));
			} else {
				this._configValueHelpDialogUsability();
				this._oValueHelpDialogUsability.open();
			}
		},
		_configValueHelpDialogUsability:function(){
			// simülasyon datasını filtrele
			this.setJSONModel(this._oObject.Usability,"usabilityList");
		},
		createOrder:function(oEvent){
			// tüm kalemler başarılı bir şekilde simüle edilmişse ve gerekli alanlar dolu ise çalışsın.
			sap.ui.getCore().getMessageManager().removeAllMessages();
			// Get Data
			var oHeader = this.getView().getModel("header").getData();
			var aItems = this.getView().getModel("orderItems").getData().results;
			oHeader.FuncName = "CreateOrder"
			// Check Data
			if ( aItems.length === 0 ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("enterItems"));
				$(".sapMMessageToast").addClass("sapMMessageToastDanger");
				return;
			}

			var bObligatoryCheck = this._checkObligatoryFields(oHeader,aItems);
			if ( !bObligatoryCheck ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("chckObligatory"));
				$(".sapMMessageToast").addClass("sapMMessageToastDanger");
				return;
			}
			
			// Deep Create
			sap.ui.core.BusyIndicator.show();
			let oEntry = this._getCreateDeepEntry(oHeader,aItems)
			let mPrm = this._getCreateOrderPrm();
			this.getView().getModel().create("/HeaderSet", oEntry, mPrm );
		},
		simulateOrder:function(){
			sap.ui.getCore().getMessageManager().removeAllMessages();
			// Get Data
			var oHeader = this.getView().getModel("header").getData();
			var aSelectedItems = this._getSelectedItems(this.byId("idOrderItemTab").getSelectedItems());
			oHeader.FuncName = "SimulateOrder";
			
			this._simulateOrder(oHeader,aSelectedItems);
			
		},
		simulateOrderPopup: function(){
			sap.ui.getCore().getMessageManager().removeAllMessages();
			// Get Data
			var oHeader = this.getView().getModel("header").getData();
			var aSelectedItems = [];
			aSelectedItems.push(this.getView().getModel("itemView").getData());
			oHeader.FuncName = "SimulateOrder";
			
			this._simulateOrder(oHeader,aSelectedItems);

		},
		_simulateOrder:function(oHeader,aSelectedItems){
			// Check Data
			if ( aSelectedItems.length === 0 ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("selectItems"));
				$(".sapMMessageToast").addClass("sapMMessageToastDanger");
				return;
			}

			var bObligatoryCheck = this._checkObligatoryFields(oHeader,aSelectedItems);
			if ( !bObligatoryCheck ){
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("chckObligatory"));
				$(".sapMMessageToast").addClass("sapMMessageToastDanger");
				return;
			}
			
			// Deep Create
			sap.ui.core.BusyIndicator.show();
			let oEntry = this._getCreateDeepEntry(oHeader,aSelectedItems)
			let mPrm = this._getSimulatePrm();
			this.getView().getModel().create("/HeaderSet", oEntry, mPrm );
		},
		_getCreateDeepEntry:function(oHeader,aSelectedItems){
			return {
				FuncName:oHeader.FuncName,
				Auart:oHeader.Auart,
				Orderno:oHeader.Orderno,
				Vkorg:oHeader.Vkorg,
				Vtweg:oHeader.Vtweg,
				Spart:oHeader.Spart,
				Vkbur:oHeader.Vkbur,
				Vkgrp:oHeader.Vkgrp,
				Kunnr:oHeader.Kunnr,
				Zterm:oHeader.Zterm,
				Inco1:oHeader.Inco1,
				Inco2:oHeader.Inco2,
				Item : aSelectedItems.map(oSelLine=>{ return {
						Posnr	    : oSelLine.Posnr.toString(),
						Material    : oSelLine.Material,
						RefDocNo    : oSelLine.RefDocNo,
						RefDocItm   : oSelLine.RefDocItm,
						Meins       : oSelLine.Meins,
						ReqDate     : oSelLine.ReqDate ? new Date(oSelLine.ReqDate) : null,
						Qty         : oSelLine.Qty ? oSelLine.Qty.toString() : "0" ,
						UnitPrice   : oSelLine.UnitPrice ? oSelLine.UnitPrice.toString() : "0",
						UnitCurr    : oSelLine.UnitCurr ? oSelLine.UnitCurr: "",
						Kscha       : oSelLine.Kscha ? oSelLine.Kscha: "",
						Price		: oSelLine.Price ? oSelLine.Price.toString() : "0",
						Currency    : oSelLine.Currency ? oSelLine.Currency : "",
						Simulate	: oSelLine.Simulate,
						Usability   :[]
					}
				})
			};
		},
		_getSimulatePrm: function(){
			return {
				success: function(oData,oResponse) {
					sap.ui.core.BusyIndicator.hide();
					let oItem = this.getView().getModel("orderItems");
					let aItem = oItem.getData().results;
					let aData = oData.Item.results;

					for (let itmIndx = 0; itmIndx < aData.length; itmIndx++) {
						let idx = aItem.findIndex(o => o.Posnr === parseInt(aData[itmIndx].Posnr) )
						let aUse = aData[itmIndx].Usability.results;
						aItem[idx].Usability = aUse;

						if (aUse.length != 0 &&
							aItem[idx].Qty <= aUse[0].ReqQty && 
							aItem[idx].ReqDate <= aUse[0].ReqDate &&
							!aData[itmIndx].Simulate ){
								
								aItem[idx].Simulate = true;
						}else{
							aItem[idx].Simulate = false;
							aItem[idx].Qty = null;
							aItem[idx].ReqDate = null;
						}
					}
					oItem.refresh();
										
				}.bind(this),
				error: function() {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)
			};
		},
		_getCreateOrderPrm: function(){
			return {
				success: function(oData,oResponse) {
					sap.ui.core.BusyIndicator.hide();
				
					var sCompleteMessage = oResponse.headers["sap-message"];
					var oMessage = JSON.parse(sCompleteMessage);
					if ( oMessage.severity == "success" ){					
						this._clearScreen({},sap.m.MessageBox.Action.YES);
						this.showSuccessMessage("", oMessage.message);
					}			
				}.bind(this),
				error: function() {
					sap.ui.core.BusyIndicator.hide();
				}
			};
		},
		_getSelectedItems: function(aSelectedList) {
			var aList = [];
			for (let selIndx = 0; selIndx < aSelectedList.length; selIndx++) {
				aList.push(this.getView().getModel("orderItems").getObject(aSelectedList[selIndx].getBindingContextPath()));
			}
			return aList;
		},
		_checkObligatoryFields:function(oHeader,aList){
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
				if ( oHeader.FuncName == "SimulateOrder" ){
					
					if ( !aList[indx].Material ||
						!aList[indx].ReqDate ||
						!aList[indx].Qty ||
						(bCusRef && !aList[indx].RefDocNo )  ){
						bObliCheck = false;
						break;
					}
				}else if ( oHeader.FuncName == "CreateOrder" ){
					if ( !aList[indx].Material ||
						!aList[indx].ReqDate ||
						!aList[indx].Qty ||
						(bCusRef && !aList[indx].RefDocNo )  ||
						!aList[indx].Price ||
						!aList[indx].Currency ||
						!aList[indx].Simulate
						){
						bObliCheck = false;
						break;
					}	
				}
			}
			return bObliCheck;
		},
		onClearScreen: function(){
			// ekranı initial duruma getir.
			this.showConfirmationDialog("sureQs", this._clearScreen);

		},
		_clearScreen:function(oEntry,pAction){
			if (pAction !== sap.m.MessageBox.Action.YES) {
				return;
			}	
			sap.ui.getCore().getMessageManager().removeAllMessages();

			let mainView = {
				bEdit:true,
				bCustomerRef:false,
				delay:0
			},

			Header = {
				Auart:"",
				FuncName:"",
				Vkorg:"",
				Vtweg:"",
				Spart:"",
				Vkbur:"",
				Vkgrp:"",
				Kunnr:"",
				Zterm:"",
				Orderno:"",
				Inco1:"",
				Inco2:"",
				Detail:[]
			},
			HeaderText ={
				AuartDesc:"",
				VkorgDesc:"",
				VtwegDesc:"",
				SpartDesc:"",
				VkburDesc:"",
				VkgrpDesc:"",
				CustomerName:"",
				ZtermDesc:"",
				Inco1Desc:""
			};


			this.getView().setModel(new JSONModel(mainView),"mainView");
			this.getView().setModel(new JSONModel(Header),"header");
			this.getView().setModel(new JSONModel(HeaderText),"headerText");
			this.setJSONModel([],"orderItems");
			this.datamodel.Item.Posnr = 0;

			this.byId("selAuart").setSelectedKey("");
			this.byId("selVkorg").setSelectedKey("");
			this.byId("selVtweg").setSelectedKey("");
			this.byId("selVkbur").setSelectedKey("");
			this.byId("selVkgrp").setSelectedKey("");
			this.byId("selSpart").setSelectedKey("");
			this.byId("selZterm").setSelectedKey("");
			this.byId("selInco1").setSelectedKey("");
			this.byId("selKunnr").setSelectedKey("");
			this.byId("inpOrder").setValue("");
			this.byId("inpInco2").setValue("");
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