sap.ui.define([
	"./BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.improva.zimpsaosipapp.controller.NotFound", {

		onLinkPressed: function() {
			this.getRouter().navTo("Main");
		}

	});

});