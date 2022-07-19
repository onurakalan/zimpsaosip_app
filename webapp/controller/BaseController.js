sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel" ], 
	function(Controller,History, Fragment, Filter, FilterOperator, MessageToast, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("com.improva.zimpsaosipapp.controller.BaseController", {

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		addHistoryEntry: (function() {
			var aHistoryEntries = [];

			return function(oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function(entry) {
					return entry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function(oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})(),

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, true);
			}
		},
		showErrorMessage: function(pTitle, pMsg) {
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var pMBTitle = this.getView().getModel("i18n").getResourceBundle().getText(pTitle);
			var pMBMessage = this.getView().getModel("i18n").getResourceBundle().getText(pMsg);
			if (!pMBMessage) {
				pMBMessage = pMsg;
			}
			MessageBox.confirm(
				pMBMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pMBTitle,
					icon: sap.m.MessageBox.Icon.ERROR,
					actions: [sap.m.MessageBox.Action.OK]
				}
			);
		},
		showSuccessMessage: function(pTitle, pMsg) {
			MessageBox.confirm(
				pMsg, {
					// styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pTitle,
					icon: sap.m.MessageBox.Icon.SUCCESS,
					actions: [sap.m.MessageBox.Action.OK]
				}
			);
		},
		showConfirmationDialog: function (sConfMsg, fAccptFunction, pEntriy ) {
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var pMBMessage = this.getView().getModel("i18n").getResourceBundle().getText(sConfMsg);
			var pMBTitle = this.getView().getModel("i18n").getResourceBundle().getText("warnTitle");
			var that = this;
			MessageBox.confirm(
				pMBMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pMBTitle,
					icon: sap.m.MessageBox.Icon.WARNING,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: fAccptFunction.bind(that, pEntriy)
				}
			);
		},
		setJSONModel: function(aData, sModel) {
			var oDataModel = new JSONModel();
			var oData = {
				results: []
			};
			oData.results = aData;

			oDataModel.setData(oData);
			oDataModel.setSizeLimit(999999);
			oDataModel.refresh();

			this.getView().setModel(oDataModel, sModel);

		},
		/* =========================================================== */
		/* SEARCH HELP
		/* =========================================================== */
		onLiveChanged: function(oEvent) {
			oEvent.getSource().setDescription("");
		},
		/* =========================================================== */
		/* MESSAGE POPOVER
		/* =========================================================== */
		onMessagePopoverPress: function(oEvent) {
			var oSourceControl = oEvent.getSource();
			this._getMessagePopover().then(function(oMessagePopover) {
				oMessagePopover.openBy(oSourceControl);
			});
		},
		_getMessagePopover: function() {
			var oView = this.getView();

			// create popover lazily (singleton)
			if (!this._pMessagePopover) {
				this._pMessagePopover = Fragment.load({
					id: oView.getId(),
					name: "com.improva.zimpsaosipapp.fragment.Message"
				}).then(function(oMessagePopover) {
					oView.addDependent(oMessagePopover);
					return oMessagePopover;
				});
			}
			return this._pMessagePopover;
		}

	});

});