sap.ui.define([
	"sap/ui/core/library"
], function(coreLibrary) {
	"use strict";
	var ValueState = coreLibrary.ValueState;
	return {
		isValidSelection(oObject){
			var sSelectedKey = oObject.getSelectedKey(),
				sValue = oObject.getValue(),
				bReturn;

			if (!sSelectedKey && sValue) {
				oObject.setValueState(ValueState.Error);
				bReturn = false;
			} else {
				oObject.setValueState(ValueState.None);
				bReturn = true;
			}
			return bReturn;
		},
		setData:function(sObjectName,sFieldName,sValue){
			this.getView().getModel(sObjectName).setProperty("/"+sFieldName, sValue);
		},
		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		getI18nText: function(sText) {
			var oRegExp = /{i18n>(.*)}/;
			return this.getResourceBundle().getText(oRegExp.exec(sText)[1]);
		},

		requestStatusColor: function(sStatus) {
			/**
			 * C: Completed
			 * D: Deleted
			 **/
			var sColor;

			switch (sStatus) {
				case "C":
					sColor = "Success";
					break;
				case "D":
					sColor = "Error";
					break;
				case "I":
					sColor = "Information";
					break;
				default:
					sColor = "Warning";
			}

			return sColor;
		},

		commentStatusColor: function(sStatus) {
			/**
			 * A: Approved
			 * R: Rejected
			 **/
			var sColor;

			switch (sStatus) {
				case "A":
					sColor = "Success";
					break;
				case "R":
					sColor = "Error";
					break;
				default:
					sColor = "Information";
			}

			return sColor;
		},
		screenStatusColor: function(sStatus) {
			/**
			 * A: Approved
			 * R: Rejected
			 * O: Read-only
			 * U: Unauthorized
			 **/
			var sColor;

			switch (sStatus) {
				case "A":
					sColor = "Positive";
					break;
				case "R":
					sColor = "Negative";
					break;
				case "O":
				case "U":
					sColor = "Neutral";
					break;
				default:
					sColor = "Default";
			}

			return sColor;
		},

		stepStatusColor: function(sStatus) {
			/**
			 * A:  Approved
			 * R:  Rejected
			 * "": Continue
			 **/
			var sColor;

			switch (sStatus) {
				case "A":
					sColor = "Success";
					break;
				case "R":
					sColor = "Error";
					break;
				default:
					sColor = "Warning";
			}

			return sColor;
		},

		dateTimeFormatter: function(oDate, oTime) {
			if (!oDate || !oTime) {
				return "";
			}

			var oDateFormatter = new sap.ui.model.type.Date();
			var oTimeFormatter = new sap.ui.model.type.Time({
				UTC: true,
				pattern: "HH:mm",
				source: {
					pattern: "timestamp"
				}
			});

			return oDateFormatter.formatValue(oDate, "string") + " " + oTimeFormatter.formatValue(oTime, "string");
		},

		userNameFormatter: function(sFullname, sSAPUserName) {
			if (!sFullname || !sSAPUserName) {
				return "";
			}

			return sFullname + " (" + sSAPUserName + ")";
		},

		setValueState: function(sValueState) {
			if (!sValueState) {
				return "None";
			}

			return sValueState;
		},

		isCellControlEditable: function(bIsScreenEditable, bIsControlEditable, bFieldValueEditable) {
			return bIsScreenEditable && bIsControlEditable && bFieldValueEditable;
		},

		isUIControlEditable: function(bIsScreenEditable, bIsControlEditable) {
			return bIsScreenEditable && bIsControlEditable;
		},

		screenWidth: function(bIsEditable) {
			return (sap.ui.Device.resize.width - 80) + "px";
		}

	};

});